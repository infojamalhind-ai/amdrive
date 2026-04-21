import PolicyPage from "@/app/components/PolicyPage";

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="Welcome to AMJDrive (operated by Al Jawla Al Akheerah Cars Rental LLC, Sharjah). By booking a vehicle through our website amjdrive.com or WhatsApp, you agree to the following terms."
    >
      <h3>1. Driver Eligibility</h3>
      <ul>
        <li>Minimum age: 25 years</li>
        <li>Driver must hold a valid driving license for at least 1 year</li>
        <li>Valid Emirates ID or Passport and Visa required</li>
      </ul>

      <h3>2. Booking & Payment</h3>
      <ul>
        <li>A small advance payment may be required to confirm booking</li>
        <li>Remaining amount can be paid at delivery by cash or card</li>
        <li>Prices shown are clear with no hidden charges</li>
      </ul>

      <h3>3. Rental Period</h3>
      <ul>
        <li>Minimum rental period may apply depending on vehicle</li>
        <li>Late return may result in additional charges</li>
        <li>Extension must be requested at least 2 hours before return time</li>
      </ul>

      <h3>4. Delivery & Collection</h3>
      <ul>
        <li>Free self-pickup available in Ajman and Sharjah</li>
        <li>Delivery and collection charges may apply depending on location</li>
      </ul>

      <h3>5. Fuel Policy</h3>
      <ul>
        <li>Vehicle must be returned with the same fuel level</li>
        <li>Refueling charges apply if not returned as received</li>
      </ul>

      <h3>6. Salik (Toll) & Fines</h3>
      <ul>
        <li>Salik will be charged per usage with admin fee</li>
        <li>Traffic fines and admin charges will be charged to the customer</li>
        <li>
          Black points will be transferred to the driver and charged AED 100
          for each point waived once transferred by UAE Pass
        </li>
      </ul>

      <h3>7. Insurance & Damage</h3>
      <ul>
        <li>Standard insurance applies with excess liability</li>
        <li>Optional damage waiver may be available</li>
        <li>In case of accident, police report is mandatory</li>
      </ul>

      <h3>8. Vehicle Use</h3>
      <ul>
        <li>Vehicle must not be used for illegal activities</li>
        <li>Off-road use is strictly prohibited unless specified</li>
      </ul>

      <h3>9. Cancellation</h3>
      <p>Cancellation terms are mentioned in the Refund Policy.</p>

      <h3>10. Agreement</h3>
      <p>A full rental agreement may be signed at delivery.</p>

      <p>
        AMJDrive, operated by Al Jawla Al Akheerah Cars Rental LLC, Sharjah,
        aims to provide brand new cars with transparent pricing and no hidden
        charges.
      </p>
    </PolicyPage>
  );
}
