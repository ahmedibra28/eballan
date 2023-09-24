const roles = [
  {
    _id: '5e0af1c63b6482125c1b22cb',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    _id: '5e0af1c63b6482125c1b44cb',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
  {
    _id: '5e0af1c63b6482125c1b55cb',
    name: 'Agent',
    description:
      'Agent can access and manage all features and settings of agent.',
    type: 'AGENT',
  },
]

const users = {
  _id: '5063114bd386d8fadbd6b00a',
  name: 'eBallan',
  email: 'info@eballan.com',
  password: '123456',
  confirmed: true,
  blocked: false,
}

const profile = {
  _id: '5063114bd386d8fadbd6b00b',
  mobile: 252615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
  normal: 3,
  report: 4,
}

const clientPermissions = [
  {
    _id: '637e0261fadbdf65bba856b6',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    _id: '637e0261fadbdf655ba856b6',
    name: 'Admin Dashboard',
    path: '/reports/dashboard',
    menu: 'report',
    sort: sort.report,
    description: 'Dashboard page',
  },
  {
    _id: '637e0261fafbdf655ba856b6',
    name: 'Agent Dashboard',
    path: '/reports/agents/dashboard',
    menu: 'report',
    sort: sort.report,
    description: 'Agent dashboard page',
  },
  {
    _id: '637e0261fadbdf656ba856b6',
    name: 'Agent Summary',
    path: '/reports/agents/summary',
    menu: 'report',
    sort: sort.report,
    description: 'Agent summary page',
  },
  {
    _id: '637e0261fadbdf65bba856b7',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    _id: '637e0261fadbdf65bba856b8',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856b9',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    _id: '637e0261fadbdf65bba856bb',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856ba',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856bc',
    name: 'User Roles',
    path: '/admin/user-roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856bd',
    name: 'User Profiles',
    path: '/admin/user-profiles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Profiles page',
  },

  // Reservation
  {
    _id: '637e0261fadbdf65bba856be',
    name: 'Reservation',
    path: '/reservations',
    menu: 'normal',
    sort: sort.normal,
    description: 'Reservations page',
  },
  {
    _id: '637e0261fadbdf65bbb856be',
    name: 'Reservation',
    path: '/reservations/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Reservation details page',
  },

  // Airline
  {
    _id: '6495854a746cfa58830bdee6',
    name: 'Airline',
    path: '/airlines',
    menu: 'normal',
    sort: sort.normal,
    description: 'Airlines page',
  },
]

const permissions = [
  // Users
  {
    _id: '637e01fbfadbdf65bba855e2',
    description: 'Users',
    route: '/api/auth/users',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e3',
    description: 'User By Id',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e4',
    description: 'User',
    route: '/api/auth/users',
    name: 'Users',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855e6',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855e7',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   User Profile
  {
    _id: '637e01fbfadbdf65bba855e5',
    description: 'Profiles',
    route: '/api/auth/user-profiles',
    name: 'User Profiles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e8',
    description: 'Profile',
    route: '/api/auth/profile',
    name: 'User Profile',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e9',
    description: 'Profile',
    route: '/api/auth/profile/:id',
    name: 'User Profile',
    method: 'PUT',
  },

  //   Role
  {
    _id: '637e01fbfadbdf65bba855ea',
    description: 'Roles',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855eb',
    description: 'Role',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855ec',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855ed',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    _id: '637e01fbfadbdf65bba855ee',
    description: 'Permissions',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855ef',
    description: 'Permission',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f0',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f1',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   User Role
  {
    _id: '637e01fbfadbdf65bba855f2',
    description: 'User Roles',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f4',
    description: 'User Role',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f3',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f5',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'DELETE',
  },

  //   Client Permission
  {
    _id: '637e01fbfadbdf65bba855f6',
    description: 'Client Permissions',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f7',
    description: 'Client Permission',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f8',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f9',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },

  //   Reservation
  {
    _id: '647ddae3f15497446e0d9e0d',
    description: 'Reservations',
    route: '/api/reservations',
    name: 'Reservations',
    method: 'GET',
  },
  {
    _id: '647ddae5f15497446e0d9e0d',
    description: 'Reservations details',
    route: '/api/reservations/:id',
    name: 'Reservations',
    method: 'GET',
  },
  {
    _id: '647ddae3f15497446e0d9e0e',
    description: 'Reservation',
    route: '/api/reservations',
    name: 'Reservations',
    method: 'POST',
  },
  {
    _id: '647ddae3f15497446e0d9e0f',
    description: 'Reservation',
    route: '/api/reservations/:id',
    name: 'Reservations',
    method: 'PUT',
  },
  {
    _id: '647ddae3f15497446e0d9e10',
    description: 'Reservation',
    route: '/api/reservations/:id',
    name: 'Reservations',
    method: 'DELETE',
  },
  {
    _id: '647ddae3f15497446e0d9e00',
    description: 'Reservation PDF',
    route: '/api/reservations/pdf',
    name: 'Reservations',
    method: 'POST',
  },

  //   Airline
  {
    _id: '649584d1746cfa58830bdee2',
    description: 'Airlines',
    route: '/api/airlines',
    name: 'Airlines',
    method: 'GET',
  },
  {
    _id: '649584d1746cfa58830bdee3',
    description: 'Airline',
    route: '/api/airlines',
    name: 'Airlines',
    method: 'POST',
  },
  {
    _id: '649584d1746cfa58830bdee4',
    description: 'Airline',
    route: '/api/airlines/:id',
    name: 'Airlines',
    method: 'PUT',
  },
  {
    _id: '649584d1746cfa58830bdee5',
    description: 'Airline',
    route: '/api/airlines/:id',
    name: 'Airlines',
    method: 'DELETE',
  },

  //   Report
  {
    _id: '649584d1746cfa58833bdee3',
    description: 'Dashboard Report',
    route: '/api/reports/dashboard',
    name: 'Report',
    method: 'GET',
  },
  {
    _id: '649584d1446cfa58833bdee3',
    description: 'Agent dashboard Report',
    route: '/api/reports/agents/dashboard',
    name: 'Report',
    method: 'GET',
  },
  {
    _id: '649584d1746cfa58833bdee4',
    description: 'Agent Summary Report',
    route: '/api/reports/agents/summary',
    name: 'Report',
    method: 'GET',
  },
]

export { roles, users, profile, permissions, clientPermissions }
