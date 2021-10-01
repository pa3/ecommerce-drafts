import { Link } from "@/view/link";
import { routes } from "@/core/routes";

export const Navbar = () => (
  <nav>
    <ul>
      <li>
        <Link url={routes.productList.getUrl()}>Products</Link>
      </li>
      <li>
        <Link url={routes.product.getUrl({ productId: "1" })}>Product</Link>
      </li>
    </ul>
  </nav>
);
