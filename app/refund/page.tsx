import PolicyPage from "@/app/components/PolicyPage";

export default function RefundPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      intro="AMJDrive, operated by Al Jawla Al Akheerah Cars Rental LLC, Sharjah, aims to keep policies fair, simple, and transparent."
    >
      <h3>1. Booking Advance</h3>
      <ul>
        <li>A small advance payment may be required to confirm booking</li>
        <li>This amount is deducted from the total rental cost</li>
      </ul>

      <h3>2. Cancellation</h3>
      <ul>
        <li>Free cancellation allowed if done in advance</li>
        <li>Late cancellation may result in partial or no refund</li>
      </ul>

      <h3>3. No Show</h3>
      <p>
        If the customer does not show up at the agreed time, the booking may be
        cancelled without refund.
      </p>

      <h3>4. Refund Processing</h3>
      <ul>
        <li>Eligible refunds are processed within a reasonable time</li>
        <li>
          Refunds are returned through the original payment method where
          possible
        </li>
      </ul>

      <h3>5. Special Cases</h3>
      <p>
        In case of vehicle unavailability or company cancellation, a full
        refund will be issued.
      </p>
    </PolicyPage>
  );
}
