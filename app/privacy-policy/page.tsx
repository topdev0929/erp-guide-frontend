import styles from "./page.module.css";

const PrivacyPolicy = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.effectiveDate}>Effective Date: October 17, 2024</p>

        <h2 className={styles.subtitle}>1. Information We Collect</h2>
        <p className={styles.paragraph}>
          We collect several types of information to provide and improve our
          Services, including:
        </p>

        <h3 className={styles.sectionTitle}>a. Personal Information</h3>
        <p className={styles.paragraph}>
          When you sign up for our Services, we may collect personally
          identifiable information, including but not limited to:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Name (if provided)</li>
          <li className={styles.listItem}>Email address</li>
          <li className={styles.listItem}>Phone number</li>
          <li className={styles.listItem}>
            Demographic information (such as age or gender, as provided)
          </li>
          <li className={styles.listItem}>
            Payment information (for subscription purposes, as applicable)
          </li>
        </ul>

        <h3 className={styles.sectionTitle}>b. Health Information</h3>
        <p className={styles.paragraph}>
          Our Services are designed to help users manage their OCD symptoms
          through ERP-based exercises. In doing so, we may collect information
          about your mental health and your responses to these exercises.
        </p>

        <h3 className={styles.sectionTitle}>c. Usage Data</h3>
        <p className={styles.paragraph}>
          We may collect information about how you access and use the Service,
          including:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Device information (such as the device type, operating system, and
            browser type)
          </li>
          <li className={styles.listItem}>IP address</li>
          <li className={styles.listItem}>
            Pages you visit and time spent on each page
          </li>
          <li className={styles.listItem}>
            App interaction data (such as button clicks and feature usage)
          </li>
        </ul>

        <h2 className={styles.subtitle}>2. How We Use Your Information</h2>
        <p className={styles.paragraph}>We use your information to:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Provide, operate, and maintain our Services
          </li>
          <li className={styles.listItem}>
            Personalize your experience within the app
          </li>
          <li className={styles.listItem}>
            Monitor and analyze usage and trends to improve the app
          </li>
          <li className={styles.listItem}>
            Respond to user inquiries and provide support
          </li>
          <li className={styles.listItem}>
            Ensure compliance with legal and regulatory requirements
          </li>
        </ul>

        <h2 className={styles.subtitle}>3. How We Share Your Information</h2>
        <p className={styles.paragraph}>
          We may share your personal information with:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Service Providers:</strong> Third-party vendors,
            consultants, and service providers.
          </li>
          <li className={styles.listItem}>
            <strong>Legal Requirements:</strong> Disclosure in compliance with
            legal obligations.
          </li>
          <li className={styles.listItem}>
            <strong>Business Transfers:</strong> As part of a merger, sale, or
            acquisition.
          </li>
        </ul>

        <h2 className={styles.subtitle}>4. Data Security</h2>
        <p className={styles.paragraph}>
          We use commercially reasonable measures to secure your information,
          but no method of transmission over the Internet or electronic storage
          is 100% secure.
        </p>

        <h2 className={styles.subtitle}>5. Your Rights</h2>
        <p className={styles.paragraph}>
          Depending on your location and applicable laws, you may have the
          following rights regarding your personal information:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Access to the data we hold about you
          </li>
          <li className={styles.listItem}>
            Correction of any inaccurate information
          </li>
          <li className={styles.listItem}>
            Deletion of your personal information, subject to certain legal
            exceptions
          </li>
          <li className={styles.listItem}>
            Opt-out of certain data processing activities (such as marketing
            communications)
          </li>
        </ul>

        <h2 className={styles.subtitle}>6. Retention of Data</h2>
        <p className={styles.paragraph}>
          We retain your information for as long as necessary to provide our
          Services and comply with legal obligations.
        </p>

        <h2 className={styles.subtitle}>7. Children's Privacy</h2>
        <p className={styles.paragraph}>
          Our Services are not intended for individuals under the age of 18. If
          we learn that we have collected personal information from a child
          under 18, we will take steps to delete such information.
        </p>

        <h2 className={styles.subtitle}>8. Changes to This Privacy Policy</h2>
        <p className={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new policy on this page.
        </p>

        <h2 className={styles.subtitle}>9. Contact Us</h2>
        <p className={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at:
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

export default PrivacyPolicy;
