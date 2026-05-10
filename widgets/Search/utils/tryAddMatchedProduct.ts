interface Product {
  id: number;
  name: string;
}

interface Params {
  text: string;
  products: Product[];
  selectedIds: number[];
  onAdd: (productId: number) => void;
  onClearText?: () => void;
}

export const tryAddMatchedProduct = ({
  text,
  products,
  selectedIds,
  onAdd,
  onClearText,
}: Params) => {
  if (!text.endsWith(" ")) {
    return false;
  }

  const normalizedText = text.trim().toLowerCase();

  if (!normalizedText.length) {
    return false;
  }

  const matchedProduct = products.find(
    (product) => product.name.trim().toLowerCase() === normalizedText
  );

  if (!matchedProduct) {
    return false;
  }

  if (selectedIds.includes(matchedProduct.id)) {
    return false;
  }

  onAdd(matchedProduct.id);

  onClearText?.();

  return true;
};
