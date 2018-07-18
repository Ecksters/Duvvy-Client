import Dashboard from "views/Dashboard.jsx";
import Transactions from "views/Transactions.jsx";
import Categories from "../views/Categories";
import Budgets from "views/Budgets.jsx";
import Trends from "views/Trends.jsx";
import BulkImport from "views/Tools/BulkImport.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import BuildIcon from "@material-ui/icons/Build"
import CreditCard from "@material-ui/icons/CreditCard";
import Timeline from "@material-ui/icons/Timeline";
import AccountBalance from "@material-ui/icons/AccountBalance";
import DonutSmall from "@material-ui/icons/DonutSmall";

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
    path: "/categories",
    name: "Categories",
    icon: DonutSmall,
    component: Categories
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
  {
    collapse: true,
    path: "/tools",
    name: "Tools",
    state: "openTools",
    icon: BuildIcon,
    views: [
      {
        path: "/tools/BulkImport",
        name: "Bulk Import",
        mini: "BI",
        component: BulkImport
      }
    ]
  },
  { redirect: true, path: "/", pathTo: "/overview", name: "Overview" }
];
export default dashRoutes;
