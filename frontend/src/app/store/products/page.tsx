'use client';

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CheckCircleIcon,
  ChevronRightIcon,
  Heading,
  Indicator,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  Text,
  PackageIcon,
  HeadsetIcon,
  SearchIcon,
  CreditCardIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "../components/BladeRoot";
import { SiteHeader } from "../components/SiteHeader";
import { ProductCard } from "../components/ProductCard";
import { useAiChat } from "../components/StoreAiProvider";
import {
  brands,
  categories,
  categoryName,
  filterProducts,
  formatPrice,
  mapDbProduct,
  products as fallbackProducts,
} from "@/lib/store/catalog";

const MAX_PRICE = 100000;
const PER_PAGE = 8;

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
];

const assurances = [
  { icon: ShieldIcon, title: "100% Original Products", sub: "Sourced directly from brands" },
  { icon: CreditCardIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: RefreshIcon, title: "Easy Returns", sub: "7 days easy returns" },
  { icon: PackageIcon, title: "Fast Delivery", sub: "Quick and reliable delivery" },
  { icon: HeadsetIcon, title: "Customer Support", sub: "24/7 customer support" },
];

function ProductsContent() {
  const { openChat } = useAiChat();
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const selectedBrands = searchParams.getAll("brand");
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : MAX_PRICE;
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const minRatingParam = searchParams.get("minRating");
  const minRating = minRatingParam ? Number(minRatingParam) : 0;
  const sort = searchParams.get("sort") ?? "popularity";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const [priceInput, setPriceInput] = useState(String(maxPrice));
  const [liveProducts, setLiveProducts] = useState<typeof fallbackProducts>([]);

  useEffect(() => {
    fetch('/api/products?status=active')
      .then((response) => response.json())
      .then((data) => {
        const live = (data.products ?? []).map(mapDbProduct);
        setLiveProducts(live.length > 0 ? live : fallbackProducts);
      })
      .catch(() => setLiveProducts(fallbackProducts));
  }, []);

  const updateSearch = (params: Record<string, string | string[] | undefined>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        current.delete(key);
      } else if (Array.isArray(val)) {
        current.delete(key);
        val.forEach((v) => current.append(key, v));
      } else {
        current.set(key, val);
      }
    });
    router.push(`/store/products?${current.toString()}`);
  };

  const results = filterProducts({
    q,
    category,
    brands: selectedBrands,
    maxPrice,
    inStock,
    onSale,
    minRating,
    sort,
  }, liveProducts);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const clearAll = () => {
    setPriceInput(String(MAX_PRICE));
    router.push("/store/products");
  };

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateSearch({ brand: next, page: "1" });
  };

  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader initialQuery={q} />

      <Box maxWidth="1200px" margin="auto" paddingX="spacing.6" paddingBottom="spacing.8">
        <BladeRoot>
          {/* Breadcrumbs */}
          <Box paddingY="spacing.4" display="flex" alignItems="center" gap="spacing.2">
            <Link href="/store" style={{ textDecoration: "none" }}>
              <Text size="xsmall" color="surface.text.gray.muted">
                Home
              </Text>
            </Link>
            <ChevronRightIcon size="xsmall" color="surface.icon.gray.muted" />
            <Text size="xsmall" weight="semibold">
              {category ? categoryName(category) : "All Products"}
            </Text>
          </Box>

          {/* Main Layout Grid */}
          <Box display="flex" flexDirection="row" gap="spacing.6" flexWrap="wrap">
            {/* Left Sidebar Filters */}
            <Box width="260px" flexShrink={0} display="flex" flexDirection="column" gap="spacing.5">
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Heading size="small" weight="semibold">
                        Filters
                      </Heading>
                      <Button variant="tertiary" size="xsmall" onClick={clearAll}>
                        Clear all
                      </Button>
                    </Box>

                    {/* Category Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Category
                      </Text>
                      <select
                        value={category}
                        onChange={(e) => updateSearch({ category: e.target.value, page: "1" })}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          background: "#fff",
                        }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </Box>

                    {/* Price Range Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Price Range
                      </Text>
                      <input
                        type="range"
                        min={499}
                        max={MAX_PRICE}
                        step={500}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        onMouseUp={() => updateSearch({ maxPrice: priceInput, page: "1" })}
                        onTouchEnd={() => updateSearch({ maxPrice: priceInput, page: "1" })}
                        style={{ width: "100%" }}
                      />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Text size="xsmall" color="surface.text.gray.muted">
                          ₹499
                        </Text>
                        <Text size="xsmall" weight="semibold">
                          {formatPrice(Number(priceInput))}
                        </Text>
                      </Box>
                    </Box>

                    {/* Brands Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Brand
                      </Text>
                      <Box display="flex" flexDirection="column" gap="spacing.2" maxHeight="160px" overflow="auto">
                        {brands.map((b) => (
                          <label key={b} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(b)}
                              onChange={() => toggleBrand(b)}
                            />
                            {b}
                          </label>
                        ))}
                      </Box>
                    </Box>

                    {/* Rating Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Customer Rating
                      </Text>
                      {[4.5, 4, 3.5].map((r) => (
                        <label key={r} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="rating"
                            checked={minRating === r}
                            onChange={() => updateSearch({ minRating: String(r), page: "1" })}
                          />
                          {r}★ &amp; above
                        </label>
                      ))}
                    </Box>

                    {/* Availability */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Availability &amp; Offers
                      </Text>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => updateSearch({ inStock: e.target.checked ? "true" : undefined, page: "1" })}
                        />
                        In Stock Only
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={onSale}
                          onChange={(e) => updateSearch({ onSale: e.target.checked ? "true" : undefined, page: "1" })}
                        />
                        On Sale Only
                      </label>
                    </Box>

                    <Button variant="secondary" size="small" isFullWidth onClick={clearAll}>
                      Clear all filters
                    </Button>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            {/* Main Products Grid */}
            <Box flex="1" minWidth="320px" display="flex" flexDirection="column" gap="spacing.5">
              {/* Header + Sort Bar */}
              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap="spacing.4">
                <Box>
                  <Heading size="medium" weight="semibold">
                    {category ? categoryName(category) : q ? `Results for "${q}"` : "All Products"}
                  </Heading>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {results.length === 0
                      ? "No products found"
                      : `Showing ${(current - 1) * PER_PAGE + 1} – ${Math.min(current * PER_PAGE, results.length)} of ${results.length} products`}
                  </Text>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3">
                  <Text size="xsmall" color="surface.text.gray.muted">
                    Sort by:
                  </Text>
                  <select
                    value={sort}
                    onChange={(e) => updateSearch({ sort: e.target.value })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      background: "#fff",
                    }}
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Box>
              </Box>

              {/* Products Cards */}
              {pageItems.length === 0 ? (
                <Card elevation="lowRaised" padding="spacing.7">
                  <CardBody>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap="spacing.4">
                      <SearchIcon size="large" color="surface.icon.gray.muted" />
                      <Heading size="small" weight="semibold">
                        No products match your filters
                      </Heading>
                      <Text size="small" color="surface.text.gray.muted">
                        Try removing a filter or searching for something else.
                      </Text>
                      <Button variant="primary" size="small" onClick={clearAll}>
                        Clear all filters
                      </Button>
                    </Box>
                  </CardBody>
                </Card>
              ) : (
                <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                  {pageItems.map((prod) => (
                    <Box key={prod.slug} flex="1" minWidth="240px" maxWidth="380px">
                      <ProductCard product={prod} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" alignItems="center" gap="spacing.2" marginTop="spacing.6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <Button
                      key={n}
                      variant={n === current ? "primary" : "secondary"}
                      size="xsmall"
                      onClick={() => updateSearch({ page: String(n) })}
                    >
                      {String(n)}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Rail AI + Assurances */}
            <Box width="260px" flexShrink={0} display="flex" flexDirection="column" gap="spacing.5">
              <Card padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
                      <Heading size="small" weight="semibold">
                        AI Shopping Assistant
                      </Heading>
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Not sure which product to choose? Our AI assistant can help you find the perfect one.
                    </Text>
                    <Button
                      variant="primary"
                      size="small"
                      icon={SparklesIcon}
                      isFullWidth
                      onClick={() => openChat()}
                    >
                      Ask AI Assistant
                    </Button>
                  </Box>
                </CardBody>
              </Card>

              <Card padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    {assurances.map(({ icon: Icon, title, sub }) => (
                      <Box key={title} display="flex" alignItems="flex-start" gap="spacing.3">
                        <Icon size="small" color="surface.icon.gray.muted" />
                        <Box>
                          <Text size="xsmall" weight="semibold">
                            {title}
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            {sub}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </BladeRoot>
      </Box>
    </Box>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Box padding="spacing.8"><Text>Loading products catalogue…</Text></Box>}>
      <ProductsContent />
    </Suspense>
  );
}
