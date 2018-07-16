import Dashboard from "views/Dashboard.jsx";
import Transactions from "views/Transactions.jsx";
import Budgets from "views/Budgets.jsx";
import Trends from "views/Trends.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import CreditCard from "@material-ui/icons/CreditCard";
import Timeline from "@material-ui/icons/Timeline";
import AccountBalance from "@material-ui/icons/AccountBalance";

var dashRoutes = [
  {
    path: "/overview",
    name: "Overview",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: CreditCard,
    component: Transactions
  },
  {
    path: "/budgets",
    name: "Budgets",
    icon: AccountBalance,
    component: Budgets
  },
  {
    path: "/trends",
    name: "Trends",
    icon: Timeline,
    component: Trends
  },
  { redirect: true, path: "/", pathTo: "/overview", name: "Overview" }
];
export default dashRoutes;