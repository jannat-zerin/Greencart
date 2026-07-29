export interface ProductDisplayLike {
  name: string;
  price: number;
  category?: string;
}

export function getPriceDisplay(product: ProductDisplayLike) {
  const normalizedName = product.name.toLowerCase();
  const normalizedCategory = (product.category || '').toLowerCase();

  const isBanana = normalizedName.includes('banana');
  const isProduce = normalizedCategory === 'fruits' || normalizedCategory === 'vegetables';
  const isBakery = normalizedCategory === 'bakery';
  const isDairy = normalizedCategory === 'dairy';
  const isPantry = normalizedCategory === 'pantry';

  let unitLabel = 'Tk/pcs';
  if (isBanana) {
    unitLabel = 'Tk/pcs';
  } else if (isProduce) {
    unitLabel = 'Tk/kg';
  } else if (isBakery) {
    unitLabel = 'Tk/pack';
  } else if (isDairy || isPantry || normalizedName.includes('milk') || normalizedName.includes('honey')) {
    unitLabel = 'Tk/pack';
  }

  const displayPrice = isBanana ? 20 : Math.floor(product.price);

  return {
    displayPrice,
    unitLabel,
    formattedPrice: `${displayPrice} ${unitLabel}`,
  };
}
