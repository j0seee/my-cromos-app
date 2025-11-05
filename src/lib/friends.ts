// src/lib/friends.ts
import { supabase } from "./supabaseClient";

export type Friendship = {
  id: string;
  requester: string;
  addressee: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
};

// sendFriendRequest uses RPC if available, otherwise insert
export async function sendFriendRequest(addresseeId: string) {
  try {
    const { data, error } = await supabase.rpc("send_friend_request", { p_to: addresseeId });
    if (error) throw error;
    return { data, error: null };
  } catch (rpcErr) {
    const { data, error } = await supabase.from("friendships").insert([{ addressee: addresseeId }]);
    return { data, error };
  }
}

export async function cancelOrDeleteFriendship(requestId: string) {
  const { error } = await supabase.from("friendships").delete().eq("id", requestId);
  return { error };
}

export async function acceptFriendRequest(requestId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select()
    .single();
  return { data, error };
}

export async function getIncomingRequests() {
  const user = (await supabase.auth.getUser()).data?.user;
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .eq("addressee", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getOutgoingRequests() {
  const user = (await supabase.auth.getUser()).data?.user;
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .eq("requester", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getFriendsList() {
  const user = (await supabase.auth.getUser()).data?.user;
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .or(`requester.eq.${user.id},addressee.eq.${user.id}`)
    .eq("status", "accepted")
    .order("updated_at", { ascending: false });

  return { data, error };
}

// Fetch profiles by array of ids. If 'profiles' table doesn't exist, returns id-only profiles.
export async function getUserProfiles(ids: string[]) : Promise<Profile[]> {
  if (!ids || !ids.length) return [];

  // try to fetch from profiles table
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")
      .in("id", ids);

    if (error) {
      // fall back to minimal
      return ids.map(id => ({ id }));
    }
    // ensure all ids returned (map missing ones to id-only)
    const map = new Map((data ?? []).map((p: any) => [p.id, p]));
    return ids.map(id => map.get(id) ?? { id });
  } catch (err) {
    return ids.map(id => ({ id }));
  }
}

// Enrich a list of friendships with profile info for the "other" user (the requester when you're addressee, or viceversa)
export async function enrichFriendRowsWithProfiles(rows: any[]) {
  // collect unique otherIds
  const currentUser = (await supabase.auth.getUser()).data?.user?.id;
  if (!currentUser) return rows.map(r => ({...r, other: { id: r.requester === currentUser ? r.addressee : r.requester }}));

  const otherIds = Array.from(new Set(rows.map(r => (r.requester === currentUser ? r.addressee : r.requester))));
  const profiles = await getUserProfiles(otherIds);
  const profMap = new Map(profiles.map(p => [p.id, p]));
  return rows.map(r => {
    const otherId = r.requester === currentUser ? r.addressee : r.requester;
    return {
      ...r,
      other: profMap.get(otherId) ?? { id: otherId }
    };
  });
}

// fetch friend collection of a friend (wrapper)
export async function fetchFriendCollection(friendId: string) {
  const { data, error } = await supabase
    .from("user_cards")
    .select("count, user_id, card_id, cards(id, code, name, image_url, stars, diamonds)")
    .eq("user_id", friendId);

  return { data, error };
}
