import { formatPrice, spiceEmoji } from "@/lib/format";
import type { Product } from "@/types/menu";

export function MenuProduct({ product, missingPriceText }: { product: Product; missingPriceText: string }) {
  const mainPrice = formatPrice(product.price);
  const spice = spiceEmoji(product.spice_level);
  const options = product.price_options ?? [];

  return (
    <article className="product-row">
      <div className="product-topline">
        <h3 className="product-name">
          {product.name}{spice ? ` ${spice}` : ""}
        </h3>
        {mainPrice ? <div className="product-price">{mainPrice}</div> : options.length === 0 ? <div className="missing-price">{missingPriceText}</div> : null}
      </div>
      {product.description ? <p className="product-description">{product.description}</p> : null}
      {options.length > 0 ? (
        <div className="price-options" aria-label={`${product.name} fiyat seçenekleri`}>
          {options.map((option) => (
            <div className="price-option" key={option.id}>
              <span className="price-option-label">{option.label}</span>
              <span className="price-option-price">{formatPrice(option.price)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
