// import { User } from "../models/user.js";
// import { Role } from "../models/role.js";
// import { Permission } from "../models/permission.js";
// import { Country } from "../models/country.js";
// import { COUNTRIES } from "./countries.js";

const permissions = [
  { name: "Dashboard Read", alias: "dashboard_read" },
  { name: "User Read", alias: "user_read" },
  { name: "WaitList Read", alias: "wait_list_read" },
  // { name: "Admin Dashboard Read", alias: "admin_dashboard_read" },

  // { name: "Dashboard Read", alias: "dashboard_read" },

  // { name: "Companies Read", alias: "companies_read" },
  // { name: "Companies Edit", alias: "companies_edit" },
  // { name: "Companies Create", alias: "companies_create" },
  // { name: "Companies Delete", alias: "companies_delete" },

  // { name: "Users Read", alias: "users_read" },
  // { name: "Users Edit", alias: "users_edit" },
  // { name: "Users Create", alias: "users_create" },
  // { name: "Users Delete", alias: "users_delete" },

  // { name: "Leave Types Read", alias: "leave_types_read" },
  // { name: "Leave Types Edit", alias: "leave_types_edit" },
  // { name: "Leave Types Create", alias: "leave_types_create" },
  // { name: "Leave Types Delete", alias: "leave_types_delete" },

  // { name: "Roles & Permissions Read", alias: "roles_&_permissions_read" },
  // { name: "Roles & Permissions Edit", alias: "roles_&_permissions_edit" },
  // { name: "Roles & Permissions Create", alias: "roles_&_permissions_create" },
  // { name: "Roles & Permissions Delete", alias: "roles_&_permissions_delete" },

  // { name: "Profile Read", alias: "profile_read" },
  // { name: "Profile Edit", alias: "profile_edit" },
  // { name: "Profile Delete", alias: "profile_delete" },

  // { name: "Leave Requests Read", alias: "leave_requests_read" },
  // { name: "Leave Requests Edit", alias: "leave_requests_edit" },

  // { name: "Request Leave Read", alias: "request_leave_read" },
  // { name: "Request Leave Edit", alias: "request_leave_edit" },
  // { name: "Request Leave Create", alias: "request_leave_create" },
  // { name: "Request Leave Delete", alias: "request_leave_delete" },

  // { name: "Recognition Achivment Read", alias: "recognition_achivment_read" },
  // { name: "Recognition Achivment Edit", alias: "recognition_achivment_edit" },
  // {
  //   name: "Recognition Achivment Create",
  //   alias: "recognition_achivment_create",
  // },
  // {
  //   name: "Recognition Achivment Delete",
  //   alias: "recognition_achivment_delete",
  // },

  // { name: "Employee Read", alias: "employee_read" },
  // { name: "Employee Edit", alias: "employee_edit" },
  // { name: "Employee Create", alias: "employee_create" },
  // { name: "Employee Delete", alias: "employee_delete" },

  // { name: "Employee Directory", alias: "employee_directory_read" },

  // { name: "Certificate Generator", alias: "certificate_generator_read" },
  // { name: "Attendance", alias: "attendance_read" },
];

const superAdminPermissions = [
  { name: "Super Admin Dashboard", alias: "spr_admn" },
  { name: "Super Admin Impersonate", alias: "spr_admn_impersonate" },
];
/**
 * Roles - Note; do not seed super admin role again if exist, it shouldn't be duplicate
 */
let roles = [
  // { roleName: "Super Admin", permissions: [], company: null },
  // { roleName: "Employee", permissions: [], company: null },
  // { roleName: "Company Admin", permissions: [], company: null },
  { roleName: "Admin", permissions: [] },
  { roleName: "Marketing Head", permissions: [] },
];

let adminUser = {
  firstName: "Super",
  lastName: "Admin",
  email: "superAdmin@mailinator.com",
  password: "V1t1nf0$$",
};
/**
 * Create Default Admin User
 */

const seed = async () => {
  console.log("Seeding started.....");
  // const permission = await Permission.create(permissions);
  // console.log("Permissions created!");

  // const role = await Role.create(roles);
  // console.log("Roles created!");

  // roles.find((r) => r.roleName === "Super Admin").permissions = permission.map(
  //   (p) => p._id
  // );

  // const sAdmin = role.find((r) => r.roleName === "Super Admin");
  // adminUser.role = sAdmin._id;

  // await User.create(adminUser);
  // console.log("Super Admin created!");

  // await Country.insertMany(COUNTRIES);
  // console.log("Countries created!");
};

export default { seed };
