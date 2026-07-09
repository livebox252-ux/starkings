import LegalPage from "@/components/layout/LegalPage";

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Information We Collect</h2>
      <p>Star King OTT is designed to be a private browsing experience. We do not require account creation, and we do not collect personal identifying information (PII) such as names, emails, or phone numbers. We may collect anonymous usage data to improve site performance.</p>
      
      <h2>2. Cookies and Local Storage</h2>
      <p>We may use local storage to save your preferences, such as your selected video server or theme settings. These are stored locally on your device and are not transmitted to our servers.</p>
      
      <h2>3. Third-Party Embeds</h2>
      <p>Our website utilizes third-party video players (iframes). When you play a video, these third parties may collect information about your interaction, including your IP address and viewing habits, and may use their own cookies. We do not control these third-party services and are not responsible for their privacy practices.</p>
      
      <h2>4. Changes to This Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Star King OTT, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2>2. Description of Service</h2>
      <p>Star King OTT provides an index of publicly available media links and embeds. We act as a search engine and directory for media found on the web.</p>
      
      <h2>3. No Hosting of Content</h2>
      <p><strong>Crucial Notice:</strong> Star King OTT does not host, upload, or manage any video files. All media is hosted on third-party servers and provided via embedded iframes. We are not responsible for the content, accuracy, compliance, copyright, legality, or any other aspect of the content of other linked sites.</p>
      
      <h2>4. User Conduct</h2>
      <p>You agree to use the service only for lawful purposes. You are solely responsible for your knowledge of and adherence to any and all laws, rules, and regulations pertaining to your use of the services.</p>
    </LegalPage>
  );
}

export function DMCA() {
  return (
    <LegalPage title="DMCA Notice">
      <h2>Digital Millennium Copyright Act (DMCA)</h2>
      <p>Star King OTT operates as an index and directory. We do not host any copyrighted material on our servers.</p>
      
      <p>All video content is hosted by third-party services. If you believe your copyrighted content is being shown without permission, you must contact the respective third-party video hosting provider to have the content removed. Since we only embed videos (via iframes), removing the video from the host server will automatically remove it from our website.</p>
      
      <p>If you believe a link on our site is infringing, you may send a removal request to our contact email with the exact URL path on our site, and we will remove the page or link from our index.</p>
    </LegalPage>
  );
}

export function Contact() {
  return (
    <LegalPage title="Contact Us">
      <p>If you have any questions about this service, the practices of this site, or your dealings with this site, please contact us.</p>
      
      <div className="bg-secondary/50 p-6 rounded-lg border border-white/10 mt-8">
        <p className="mb-0"><strong>Email:</strong> support@starkingott.com</p>
        <p className="mb-0 mt-2 text-sm text-muted-foreground">Please note that we do not respond to DMCA requests for hosted video files, as we do not host any files. Contact the video host directly.</p>
      </div>
    </LegalPage>
  );
}
