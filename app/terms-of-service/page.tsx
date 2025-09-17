import styles from "./page.module.css";

const TermsOfService = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.effectiveDate}>Effective Date: October 17, 2024</p>

        <h2 className={styles.subtitle}>1. Acceptance of Terms</h2>
        <p className={styles.paragraph}>
          By accessing and using the CurioMD, Inc. ("we," "our," or "us")
          services ("Services"), you agree to comply with and be bound by the
          following terms and conditions.
        </p>

        <h2 className={styles.subtitle}>2. Eligibility</h2>
        <p className={styles.paragraph}>
          You must be at least 18 years old to use our Services. By using our
          Services, you represent and warrant that you are at least 18 years
          old.
        </p>

        <h2 className={styles.subtitle}>3. Use of Services</h2>
        <p className={styles.paragraph}>
          You agree to use the Services in compliance with all applicable laws
          and regulations. You may not:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Use the Services for any unlawful purpose or to solicit others to
            perform or participate in any unlawful acts.
          </li>
          <li className={styles.listItem}>
            Interfere with or disrupt the Services or the servers or networks
            connected to the Services.
          </li>
          <li className={styles.listItem}>
            Attempt to gain unauthorized access to any portion of the Services
            or any other systems or networks connected to the Services.
          </li>
        </ul>

        <h2 className={styles.subtitle}>4. Intellectual Property</h2>
        <p className={styles.paragraph}>
          All content provided through the Services, including but not limited
          to text, graphics, logos, and software, is the property of CurioMD,
          Inc. and is protected by intellectual property laws.
        </p>

        <h2 className={styles.subtitle}>5. Limitation of Liability</h2>
        <p className={styles.paragraph}>
          To the fullest extent permitted by law, CurioMD, Inc. will not be
          liable for any direct, indirect, incidental, special, or consequential
          damages resulting from your use of the Services.
        </p>

        <h2 className={styles.subtitle}>6. Termination</h2>
        <p className={styles.paragraph}>
          We may terminate or suspend your access to the Services immediately,
          without prior notice, for conduct that we believe violates these Terms
          of Service or is harmful to other users or us.
        </p>

        <h2 className={styles.subtitle}>7. Changes to the Terms</h2>
        <p className={styles.paragraph}>
          We reserve the right to modify or update these Terms of Service at any
          time. Changes will be effective immediately upon posting the revised
          terms on our website. It is your responsibility to review these Terms
          of Service periodically.
        </p>

        <h2 className={styles.subtitle}>8. Governing Law</h2>
        <p className={styles.paragraph}>
          These Terms of Service and any disputes related to them will be
          governed by the laws of the State of Delaware.
        </p>

        <h2 className={styles.subtitle}>9. Contact Information</h2>
        <p className={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact
          us at:
        </p>
        <p className={styles.paragraph}>
          <strong>CurioMD, Inc. DBA Mango Health</strong>
          <br />
          <strong>info@themangohealth.com</strong>
          <br />
          <strong>
            950 6th Ave, 11th Floor - Suite 201, New York, NY 10001
          </strong>
        </p>
      </div>
    </main>
  );
};

export default TermsOfService;
