import Link from "next/link";
import { Check, Zap, BadgeCheck } from "lucide-react";

interface PricingPlan {
  id: "monthly" | "annual";
  name: string;
  price: number;
  pricePerMonth: number;
  duration: string;
  savings?: string;
  badge?: string;
  ctaHref: string;
}

const plans: PricingPlan[] = [
  {
    id: "monthly",
    name: "Paket Bulanan",
    price: 20_000,
    pricePerMonth: 20_000,
    duration: "per bulan",
    ctaHref: "/register",
  },
  {
    id: "annual",
    name: "Paket Tahunan",
    price: 200_000,
    pricePerMonth: 16_700,
    duration: "per tahun",
    savings: "Hemat Rp40.000 (2 bulan gratis)",
    badge: "Paling Hemat",
    ctaHref: "/register",
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const features = [
  "Menu digital unlimited",
  "QR Code & URL toko unik",
  "Upload foto per item",
  "Kategori menu kustom",
  "Kustomisasi tampilan",
  "Analitik kunjungan",
];

export function PricingSection() {
  return (
    <section id="harga" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Harga
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
            Pilih paket yang{" "}
            <span className="text-green-500">sesuai kebutuhan</span>
          </h2>
          <p className="mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
            Mulai gratis 3 hari, lanjutkan dengan paket yang paling hemat untuk
            bisnis Anda.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {plans.map((plan) => {
            const isAnnual = plan.id === "annual";
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col ${
                  isAnnual
                    ? "border-2 border-green-500 bg-white shadow-xl shadow-green-100 scale-[1.02]"
                    : "border border-gray-200 bg-white"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p className="text-sm font-semibold text-gray-500 mb-3">
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                    {formatRupiah(plan.price)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    /{plan.duration === "per bulan" ? "bulan" : "tahun"}
                  </span>
                </div>

                {/* Equivalent per month for annual */}
                {isAnnual && (
                  <p className="text-green-600 text-sm font-medium mb-1">
                    ~{formatRupiah(plan.pricePerMonth)}/bulan
                  </p>
                )}

                {/* Savings */}
                {plan.savings && (
                  <div className="mt-2 mb-4 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {plan.savings}
                  </div>
                )}

                {!plan.savings && <div className="mb-4" />}

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className="w-4 h-4 text-green-500 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isAnnual
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Mulai Sekarang
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
