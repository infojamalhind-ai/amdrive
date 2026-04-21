import PolicyPage from "@/app/components/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="At AMJDrive (operated by Al Jawla Al Akheerah Cars Rental LLC, Sharjah), we respect your privacy and are committed to protecting your personal information."
    >
      <h3>1. Information We Collect</h3>
      <p>We may collect:</p>
      <ul>
        <li>Name</li>
        <li>Phone number</li>
        <li>Email address</li>
        <li>Identification details such as Emirates ID or Passport</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>Your information is used to:</p>
      <ul>
        <li>Process bookings</li>
        <li>Contact you regarding your rental</li>
        <li>Provide customer support</li>
        <li>Improve our services</li>
      </ul>

      <h3>3. Payment Security</h3>
      <p>
        Online payments are securely processed through trusted providers. We do
        not store your card details.
      </p>

      <h3>4. Sharing of Information</h3>
      <p>
        We do not sell or share your personal information with third parties,
        except:
      </p>
      <ul>
        <li>When required by law</li>
        <li>For processing payments or legal obligations</li>
      </ul>

      <h3>5. Data Protection</h3>
      <p>
        We take reasonable measures to protect your data from unauthorized
        access.
      </p>

      <h3>6. Contact</h3>
      <p>
        For any privacy-related questions, contact us via WhatsApp or phone.
      </p>

      <p>By using our services, you agree to this Privacy Policy.</p>
    </PolicyPage>
  );
}
