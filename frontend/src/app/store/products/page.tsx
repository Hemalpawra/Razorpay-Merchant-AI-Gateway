'use client';

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Amount,
  ActionList,
  ActionListItem,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckCircleIcon,
  ChevronRightIcon,
  Dropdown,
  DropdownOverlay,
  Heading,
  Indicator,
  Radio,
  RadioGroup,
  RefreshIcon,
  SelectInput,
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
import { ActiveFilterChip } from "../components/ActiveFilterChips";
import {
  categories,
  categoryName,
  filterProducts,
  formatPrice,
  getBrands,
  mapDbProduct,
  type Product,
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
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetch('/api/products?status=active')
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLiveProducts((data.products ?? []).map(mapDbProduct));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const brands = getBrands(liveProducts);

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
                      <Dropdown selectionType="single">
                        <SelectInput
                          label="Category"
                          placeholder="All Categories"
                          value={category}
                          onChange={({ values }) =>
                            updateSearch({ category: values[0] ?? "", page: "1" })
                          }
                        />
                        <DropdownOverlay>
                          <ActionList>
                            <ActionListItem title="All Categories" value="" />
                            {categories.map((c) => (
                              <ActionListItem key={c.slug} title={c.name} value={c.slug} />
                            ))}
                          </ActionList>
                        </DropdownOverlay>
                      </Dropdown>
                    </Box>

                    {/* Price Range Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Price Range (max {formatPrice(MAX_PRICE)})
                      </Text>
                      <input
                        type="range"
                        aria-label="Maximum price"
                        aria-valuetext={formatPrice(Number(priceInput))}
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
                          <Checkbox
                            key={b}
                            isChecked={selectedBrands.includes(b)}
                            onChange={() => toggleBrand(b)}
                          >
                            {b}
                          </Checkbox>
                        ))}
                      </Box>
                    </Box>

                    {/* Rating Filter */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <RadioGroup
                        label="Customer Rating"
                        value={String(minRating)}
                        onChange={({ value }) =>
                          updateSearch({ minRating: String(value), page: "1" })
                        }
                      >
                        <Radio value="4.5">4.5★ &amp; above</Radio>
                        <Radio value="4">4★ &amp; above</Radio>
                        <Radio value="3.5">3.5★ &amp; above</Radio>
                      </RadioGroup>
                    </Box>

                    {/* Availability */}
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">
                        Availability &amp; Offers
                      </Text>
                      <Checkbox
                        isChecked={inStock}
                        onChange={({ isChecked }) =>
                          updateSearch({ inStock: isChecked ? "true" : undefined, page: "1" })
                        }
                      >
                        In Stock Only
                      </Checkbox>
                      <Checkbox
                        isChecked={onSale}
                        onChange={({ isChecked }) =>
                          updateSearch({ onSale: isChecked ? "true" : undefined, page: "1" })
                        }
                      >
                        On Sale Only
                      </Checkbox>
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

              {/* Active Filter Chips */}
              <Box display="flex" flexDirection="row" gap="spacing.2" flexWrap="wrap" alignItems="center">
                <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
                  Active filters:
                </Text>
                
                <ActiveFilterChip
                  label="Search"
                  type="search"
                  value={q}
                  onRemove={() => updateSearch({ q: "" })}
                />
                <ActiveFilterChip
                  label="Category"
                  type="category"
                  value={category}
                  onRemove={() => updateSearch({ category: "" })}
                />
                <ActiveFilterChip
                  label="Brand"
                  type="brand"
                  value={selectedBrands}
                  onRemove={() => updateSearch({ brand: [] })}
                />
                <ActiveFilterChip
                  label="Max Price"
                  type="price"
                  value={maxPrice !== MAX_PRICE ? String(maxPrice) : null}
                  onRemove={() => updateSearch({ maxPrice: String(MAX_PRICE) })}
                />
                <ActiveFilterChip
                  label="Min Rating"
                  type="rating"
                  value={minRating > 0 ? String(minRating) : null}
                  onRemove={() => updateSearch({ minRating: "" })}
                />
                <ActiveFilterChip
                  label="In Stock"
                  type="availability"
                  value={inStock ? "true" : null}
                  onRemove={() => updateSearch({ inStock: undefined })}
                />
                <ActiveFilterChip
                  label="On Sale"
                  type="availability"
                  value={onSale ? "true" : null}
                  onRemove={() => updateSearch({ onSale: undefined })}
                />
                
                {(q || category || selectedBrands.length > 0 || maxPrice !== MAX_PRICE || minRating > 0 || inStock || onSale) && (
                  <Button variant="tertiary" size="xsmall" onClick={clearAll}>
                    Clear all
                  </Button>
                )}
              </Box>

              {/* Products Cards */}
              {status === "error" ? (
                <Alert
                  color="negative"
                  isFullWidth
                  title="Unable to load products"
                  description="We could not reach the product catalog. Please refresh the page to try again."
                />
              ) : pageItems.length === 0 ? (
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
