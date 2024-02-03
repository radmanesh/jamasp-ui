import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <Box sx={{ mt: 5, m: 1 }}>
      <Typography variant="h1">Terms of Service and Privacy Policy</Typography>
      <Typography variant='h2' >Jamasp Study</Typography>
      <div id="agreement-content">
        <Typography variant="h5">Introduction</Typography>
        <Typography variant="body1">This Terms of Service and Privacy Policy ("Agreement") outlines the terms and conditions governing your participation in the non-profit health study named "Jamasp". This Agreement is between you ("Participant") and "Jamasp".</Typography>
        <Typography variant="h5">1. Participation</Typography>
        <Typography variant="body1">1.1 By participating in the Study, you agree to be bound by the terms of this Agreement.</Typography>
        <Typography variant="body1">1.2 You acknowledge that you are at least 18 years old and have the legal capacity to enter into this Agreement.</Typography>
        <Typography variant="body1">1.3 You voluntarily agree to participate in the Study and understand that you may withdraw your participation at any time.</Typography>

        <Typography variant="h5">2. Data Collection and Use</Typography>
        <Typography variant="body1">2.1 The Study will collect data about you, including [list specific types of data collected, e.g., demographic information, health history, survey responses].</Typography>
        <Typography variant="body1">2.2 All data will be collected and used in accordance with applicable laws and regulations, including [mention relevant privacy laws, e.g., HIPAA, GDPR]. </Typography>
        <Typography variant="body1">2.3 The data will be de-identified before being used for research purposes. This means that your name and other personally identifiable information will be removed from the data.</Typography>
        <Typography variant="body1">2.4 The data will be used for the following purposes: [list specific research purposes].</Typography>
        <Typography variant="body1">2.5 You may have the right to access and update your data. Please contact [contact information] for more information.</Typography>

        <Typography variant="h5">3. Confidentiality</Typography>
        <Typography variant="body1">3.1 The Organization will take reasonable steps to protect the confidentiality of your data.</Typography>
        <Typography variant="body1">3.2 However, the Organization cannot guarantee that your data will never be disclosed. For example, your data may be disclosed if required by law or to protect the safety of yourself or others.</Typography>

        <Typography variant="h5">4. Intellectual Property</Typography>
        <Typography variant="body1">4.1 All intellectual property rights associated with the Study, including the data, belong to the Organization.</Typography>
        <Typography variant="body1">4.2 You agree not to use any of the Study materials for any commercial purpose without the written permission of the Organization.</Typography>

        <Typography variant="h5">5. Disclaimer</Typography>
        <Typography variant="body1">5.1 The Study is provided "as is" and without any warranties of any kind, express or implied.</Typography>
        <Typography variant="body1">5.2 The Organization does not guarantee that the Study will be successful or that you will benefit from participating in the Study.</Typography>

        <Typography variant="h5">6. Limitation of Liability</Typography>
        <Typography variant="body1">6.1 The Organization will not be liable for any damages arising out of your participation in the Study, to the extent permitted by law.</Typography>

        <Typography variant="h5">7. Governing Law</Typography>
        <Typography variant="body1">7.1 This Agreement shall be governed by and construed in accordance with the laws of United States of America.</Typography>

        <Typography variant="h5">8. Entire Agreement</Typography>
        <Typography variant="body1">8.1 This Agreement constitutes the entire agreement between you and the Organization with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, or agreements, whether oral or written.</Typography>

        <Typography variant="h5">9. Amendments</Typography>
        <Typography variant="body1">9.1 The Organization may amend this Agreement at any time by posting the amended terms on its website.</Typography>
        <Typography variant="body1">9.2 Your continued participation in the Study after the amended terms are posted constitutes your acceptance of the amended Agreement.</Typography>

        <Typography variant="h5">Contact Us</Typography>
        <Typography variant="body1">
          If you have any questions or concerns about this Agreement, please contact us at: <Link href="mailto:support@cut.social">
            support@cut.social
          </Link>
        </Typography>
      </div>
    </Box>
  );
};

export default Privacy;