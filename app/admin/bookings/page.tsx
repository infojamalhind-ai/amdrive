import { getSupabaseAdmin } from "@/lib/supabase";
import AdminBookingsTable from "@/app/components/AdminBookingsTable";

type BookingRow = {
  id: string;
  booking_number: string;
  created_at: string;
  car_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;
  total_days: number;
  pricing_type: string;
  total_price: number;
  deposit_type?: string | null;
  payment_option?: string | null;
  booking_status?: string | null;
  payment_status?: string | null;
  advance_paid?: number | null;
  pending_amount?: number | null;
};

type ChargeRow = {
  id: string;
  booking_id: string;
  created_at: string;
  charge_type: string;
  title: string;
  description?: string | null;
  amount: number;
  status: string;
};

export default async function AdminBookingsPage() {
  const supabase = getSupabaseAdmin();

  const [
    { data: bookings, error: bookingsError },
    { data: charges, error: chargesError },
  ] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase
      .from("booking_charges")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (bookingsError) {
    return <div className="p-8">Error loading bookings</div>;
  }

  if (chargesError) {
    return <div className="p-8">Error loading booking charges</div>;
  }

  const rows: BookingRow[] = bookings ?? [];
  const chargeRows: ChargeRow[] = charges ?? [];

  const totalBookings = rows.length;

  const totalRevenue = rows.reduce(
    (sum, item) => sum + Number(item.total_price || 0),
    0
  );

  const totalAdvancePaid = rows.reduce(
    (sum, item) => sum + Number(item.advance_paid || 0),
    0
  );

  const totalPendingBalance = rows.reduce(
    (sum, item) => sum + Number(item.pending_amount || 0),
    0
  );

  const totalPaidCharges = chargeRows
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalUnpaidCharges = chargeRows
    .filter((item) => item.status !== "paid" && item.status !== "cancelled")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const noDepositCount = rows.filter(
    (item) => item.deposit_type === "no_deposit"
  ).length;

  const withDepositCount = rows.filter(
    (item) => item.deposit_type !== "no_deposit"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <a
            href="/admin/bookings/create"
            className="inline-block w-full rounded-2xl bg-purple-700 px-6 py-3 text-center text-sm font-bold text-white hover:bg-purple-800 sm:w-auto"
          >
            + Create Booking
          </a>
        </div>

        <div className="mb-6 rounded-3xl bg-slate-900 p-5 text-white sm:mb-8 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            AMJDrive Admin Bookings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Manage bookings, payment status, extra charges, and booking history.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:mb-8 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {totalBookings}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Total Booking Value</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              AED {totalRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Advance Paid</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              AED {totalAdvancePaid.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Pending Balance</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              AED {totalPendingBalance.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Paid Extra Charges</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              AED {totalPaidCharges.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Unpaid Extra Charges</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              AED {totalUnpaidCharges.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Deposit Mix</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {withDepositCount} With Deposit / {noDepositCount} No Deposit
              </h2>
            </div>

            <div>
              <p className="text-sm text-slate-500">Admin Menu</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Bookings - Charges - History
              </h2>
            </div>

            <div>
              <p className="text-sm text-slate-500">Quick Use</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Filter by status, search customer, view charge history
              </h2>
            </div>
          </div>
        </div>

        <AdminBookingsTable bookings={rows} charges={chargeRows} />
      </div>
    </main>
  );
}
