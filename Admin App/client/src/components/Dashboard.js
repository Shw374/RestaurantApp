import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import "./Dashboard.css";

import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  return (
    <div className="section-container">
      <Container className="grid-container">
        <Typography variant="h2" component="h1" gutterBottom color="common.white"> 
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Top 10 Order Titans"
              subtitle="The top 10 restaurants that have the most orders"
              imageName=""
              lookerUrl=""
              linkPath=""
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Popular Food"
              subtitle="The top 10 food items ordered across restaurants"
              imageName=""
              lookerUrl=""
              linkPath=""
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Order Peaks"
              subtitle="The top 10 periods when the food is most ordered"
              imageName=""
              lookerUrl=""
              linkPath=""
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Top 10 Order Royalty"
              subtitle="The top 10 customers who have ordered the most"
              imageName=""
              lookerUrl=""
              linkPath=""
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              title="Restaurant Feedback"
              subtitle="Reviews filtered based on restaurant names"
              imageName="user-feedback.jpg"
              lookerUrl="https://lookerstudio.google.com/embed/reporting/32f2f881-ab02-4485-8459-0db54e1afcaf/page/tEnnC"
              linkPath="feedbacks"
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;