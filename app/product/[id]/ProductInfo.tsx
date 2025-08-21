import type { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuoteState } from "@/hooks/useQuoteState";
import RequestQuoteDialog from "@/components/RequestQuoteDialog";

export default function ProductInfo({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);

  // Quote state management
  const {
    buttonState,
    buttonText,
    buttonColor,
    isDisabled: quoteDisabled,
    quote,
    isLoading: quoteLoading,
    submitQuote,
    handlePayment,
    refetch: refetchQuote,
  } = useQuoteState(product._id, product.name);
  const maxQty =
    quote && quote.status === "accepted" && quote.approvedQuantity
      ? quote.approvedQuantity
      : product.quantity;
  const outOfStock = maxQty < 1;

  useEffect(() => {
    if (quote && quote.status === "accepted" && quote.approvedQuantity) {
      setQuantity(quote.approvedQuantity);
    }
  }, [quote]);
  const handleAddToCart = () => {
    if (quantity > maxQty) {
      toast.error("Cannot add more than available stock");
      return;
    }
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.imageCover,
        moq: product.moq || 1,
      })
    );
    toast.success("Added to cart");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-400">
          {"★".repeat(Math.round(product.rating || 0)).padEnd(5, "☆")}
        </span>
        <span className="text-gray-500 text-sm">
          ({product.reviews?.length || 0} Reviews)
        </span>
        <span className="text-green-600 font-semibold ml-2">
          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <span className="text-gray-400 ml-2">
          • {product.stockQuantity || product.quantity} available
        </span>
        {product.moq && product.moq > 1 && (
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
            Min. order: {product.moq}
          </div>
        )}
      </div>
      <div className="mb-2 text-gray-700">{product.description}</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-bold">
          ₦{product.price.toLocaleString()}/{product.priceUnit}
        </span>
        {product.priceDiscount && (
          <span className="line-through text-gray-400 ml-2">
            ₦{(product.price + product.priceDiscount).toLocaleString()}/
            {product.priceUnit}
          </span>
        )}
      </div>
      <div className="mb-2 text-sm text-gray-700 space-x-4">
        {product.serialNumber && (
          <>
            Serial number{" "}
            <span className="font-bold">{product.serialNumber}</span> &nbsp;|
          </>
        )}
        {product.dimensions && (
          <>
            Size{" "}
            <span className="font-bold">
              {product.dimensions.length} x {product.dimensions.width} x{" "}
              {product.dimensions.height} {product.dimensions.unit}
            </span>{" "}
            &nbsp;|
          </>
        )}
        {product.brand &&
          typeof product.brand === "object" &&
          "name" in product.brand && (
            <>
              Brand <span className="font-bold">{product.brand.name}</span>
            </>
          )}
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Colours:</span>
          {(product.colors || []).map((color, i) => (
            <span
              key={i}
              className="inline-block w-5 h-5 rounded-full border-2 border-gray-300"
              style={{ background: color }}
            ></span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Size:</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>{product.priceUnit}</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-14">
          <button
            type="button"
            className="px-2 py-1 cursor-pointer rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={
              outOfStock ||
              quantity <= 1 ||
              !!(quote && quote.status === "accepted")
            }
          >
            –
          </button>
          <input
            type="number"
            min={1}
            max={maxQty}
            value={quantity}
            onChange={(e) => {
              const val = Math.max(1, Math.min(maxQty, Number(e.target.value)));
              setQuantity(val);
            }}
            className="text-center border rounded px-2 py-2 w-10"
            disabled={outOfStock || !!(quote && quote.status === "accepted")}
          />
          <button
            type="button"
            className="px-2 py-1 cursor-pointer rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={
              outOfStock ||
              quantity >= maxQty ||
              !!(quote && quote.status === "accepted")
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          className="flex-1 border cursor-pointer border-gray-900 py-3 rounded-full font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>

        {/* Dynamic Quote Button */}
        {!session ? (
          // Show login prompt if not authenticated
          <button
            className="flex-1 border border-yellow-400 text-yellow-600 py-3 rounded-full font-semibold hover:bg-yellow-50 transition-colors"
            onClick={() => {
              toast.error("Please login to request a quote");
              window.location.href = "/auth/signin";
            }}
          >
            Request Quote
          </button>
        ) : buttonState === "request" || buttonState === "rejected" ? (
          // Show quote dialog for new requests or after rejection
          <RequestQuoteDialog
            product={product}
            onSubmitQuote={(quoteData) =>
              submitQuote(quoteData, product.imageCover)
            }
            isLoading={quoteLoading}
          >
            <button
              className={`flex-1 border py-3 rounded-full font-semibold transition-colors 
                ${
                  quantity < (product?.moq || 1)
                    ? "cursor-not-allowed bg-gray-200 text-white border-gray-200 opacity-70"
                    : "cursor-pointer " + buttonColor
                }
              `}
              disabled={quoteDisabled || quantity < (product?.moq || 1)}
            >
              {quoteLoading ? "Loading..." : buttonText}
            </button>
          </RequestQuoteDialog>
        ) : (
          // Show status button for pending/approved states
          <button
            className={`flex-1 border py-3 rounded-full font-semibold transition-colors ${buttonColor} ${
              quoteDisabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={quoteDisabled}
            onClick={buttonState === "approved" ? handlePayment : undefined}
          >
            {quoteLoading ? "Loading..." : buttonText}
          </button>
        )}
      </div>

      {/* Quote Status Information */}
      {quote && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800 font-semibold mb-1">
            Quote Status: {quote.status.toUpperCase()}
          </div>
          {quote.status === "pending" && (
            <p className="text-xs text-blue-600">
              Your quote request has been submitted. We'll review it and get
              back to you soon.
            </p>
          )}
          {quote.status === "accepted" &&
            quote.approvedPrice &&
            quote.approvedQuantity && (
              <div className="text-xs text-blue-600">
                <p>
                  Approved Price: ₦{quote.approvedPrice.toLocaleString()} per
                  unit
                </p>
                <p>Approved Quantity: {quote.approvedQuantity} units</p>
                <p className="font-semibold mt-1">
                  Total: ₦
                  {(
                    quote.approvedPrice * quote.approvedQuantity
                  ).toLocaleString()}
                </p>
              </div>
            )}
          {quote.status === "rejected" && quote.responseMessage && (
            <p className="text-xs text-blue-600">
              Admin Response: {quote.responseMessage}
            </p>
          )}
          {quote.responseMessage && quote.status !== "rejected" && (
            <p className="text-xs text-blue-600">
              Message: {quote.responseMessage}
            </p>
          )}
        </div>
      )}
      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="w-full cursor-pointer bg-gray-900 text-white py-3 rounded-full font-semibold mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Buy now
      </button>
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-2">
        <div>
          <div className="font-semibold mb-1">Free Delivery</div>
          <div className="text-xs text-gray-500">
            Enter your postal code for Delivery Availability
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Return Delivery</div>
          <div className="text-xs text-gray-500">
            Free 30 Days Delivery Returns. Details
          </div>
        </div>
      </div>
      <a href="#" className="text-yellow-500 text-sm underline">
        Delivery terms & conditions
      </a>
    </div>
  );
}
