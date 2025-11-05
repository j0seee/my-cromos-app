import { supabase } from "@/lib/supabaseClient";

export const fetchUserCollection = async (userId: string) => {
  const { data: allCards, error } = await supabase
    .from("cards")
    .select(`
      id,
      code,
      name,
      image_url,
      stars,
      diamonds,
      user_cards (
        count
      )
    `)
    .order("id", { ascending: true });

  if (error) throw error;

  return allCards.map((card: any) => ({
    id: card.id,
    code: card.code,
    name: card.user_cards?.length ? card.name : "Carta no obtenida",
    imageUrl: card.user_cards?.length ? card.image_url : "https://pxtvlpladpxlcgrqmjtv.supabase.co/storage/v1/object/public/cromosIlus/C0000.jpg",
    stars: card.user_cards?.length ? card.stars : 0,
    diamonds: card.user_cards?.length ? card.diamonds : 0,
    count: card.user_cards?.length ? card.user_cards[0].count : 0,
  }));
};
