import React from 'react';

const LookerEmbed = () => {
  const lookerUrl = 'https://lookerstudio.google.com/embed/reporting/de639c95-4d25-45dd-b559-b822644cc152/page/tEnnC';

  return (
    <div>
      <h1>Top 10 Restaurants with most orders</h1>
      <iframe
        title="Looker Embed"
        src={lookerUrl}
        width="800"
        height="600"
      ></iframe>
    </div>
  );
};

export default LookerEmbed;
