'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  UserPlus, 
  Building2, 
  MapPin, 
  Shield, 
  Edit, 
  Trash2, 
  Plus,
  Settings,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  orgId: string;
  entityId?: string;
  role: 'owner' | 'admin' | 'manager' | 'agent';
  directLocationIds: string[];
  groupIds: string[];
  managerUserId?: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LocationGroup {
  id: string;
  orgId: string;
  name: string;
  locationIds: string[];
  memberUserIds: string[];
  managerUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Location {
  id: string;
  name: string;
  code: string;
  type: 'office' | 'branch' | 'warehouse' | 'retail' | 'headquarters';
  isActive: boolean;
}

export default function UserManagement() {
  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      orgId: 'org1',
      entityId: 'entity1',
      role: 'admin',
      directLocationIds: ['loc1', 'loc2'],
      groupIds: ['group1'],
      managerUserId: undefined,
      email: 'admin@demo.com',
      name: 'John Admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'user2',
      orgId: 'org1',
      entityId: 'entity1',
      role: 'manager',
      directLocationIds: ['loc1'],
      groupIds: ['group1', 'group2'],
      managerUserId: 'user1',
      email: 'manager@demo.com',
      name: 'Jane Manager',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'user3',
      orgId: 'org1',
      role: 'agent',
      directLocationIds: [],
      groupIds: ['group2'],
      managerUserId: 'user2',
      email: 'agent@demo.com',
      name: 'Bob Agent',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]);

  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([
    {
      id: 'group1',
      orgId: 'org1',
      name: 'Sales Team',
      locationIds: ['loc1', 'loc2'],
      memberUserIds: ['user1', 'user2'],
      managerUserId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'group2',
      orgId: 'org1',
      name: 'Support Team',
      locationIds: ['loc2', 'loc3'],
      memberUserIds: ['user2', 'user3'],
      managerUserId: 'user2',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ]);

  const mockLocations: Location[] = [
    { id: 'loc1', name: 'Downtown Office', code: 'DT001', type: 'office', isActive: true },
    { id: 'loc2', name: 'Uptown Branch', code: 'UT002', type: 'branch', isActive: true },
    { id: 'loc3', name: 'Main Warehouse', code: 'WH001', type: 'warehouse', isActive: true },
    { id: 'loc4', name: 'Corporate HQ', code: 'HQ001', type: 'headquarters', isActive: true },
  ];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserAllowedLocations = (user: User) => {
    const directLocations = user.directLocationIds;
    const groupLocations = locationGroups
      .filter(group => user.groupIds.includes(group.id))
      .flatMap(group => group.locationIds);
    
    return [...new Set([...directLocations, ...groupLocations])];
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: LocationGroup) => {
    setSelectedGroup(group);
    setIsGroupDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">User & Claims Management</h1>
          <p className="text-muted-foreground">
            Sprint 1 - Manage users, location groups, and access permissions
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Location Groups</TabsTrigger>
            <TabsTrigger value="permissions">Permissions Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Button onClick={handleCreateUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Organization Users
                </CardTitle>
                <CardDescription>
                  Manage user roles, locations, and group memberships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Direct Locations</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Total Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const allowedLocations = getUserAllowedLocations(user);
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.directLocationIds.map(locId => {
                                const location = mockLocations.find(l => l.id === locId);
                                return (
                                  <Badge key={locId} variant="outline" className="text-xs">
                                    {location?.code || locId}
                                  </Badge>
                                );
                              })}
                              {user.directLocationIds.length === 0 && (
                                <span className="text-sm text-muted-foreground">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.groupIds.map(groupId => {
                                const group = locationGroups.find(g => g.id === groupId);
                                return (
                                  <Badge key={groupId} variant="secondary" className="text-xs">
                                    {group?.name || groupId}
                                  </Badge>
                                );
                              })}
                              {user.groupIds.length === 0 && (
                                <span className="text-sm text-muted-foreground">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {allowedLocations.length} location{allowedLocations.length !== 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Location Groups</h2>
              <Button onClick={handleCreateGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid gap-4">
              {locationGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {group.name}
                        </CardTitle>
                        <CardDescription>
                          {group.locationIds.length} locations • {group.memberUserIds.length} members
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Locations</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {group.locationIds.map(locId => {
                            const location = mockLocations.find(l => l.id === locId);
                            return (
                              <Badge key={locId} variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {location?.name || locId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Members</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {group.memberUserIds.map(userId => {
                            const user = users.find(u => u.id === userId);
                            return (
                              <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {user?.name || userId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <h2 className="text-2xl font-semibold">Permissions Overview</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Matrix
                </CardTitle>
                <CardDescription>
                  Overview of user access to locations through direct assignment and groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        {mockLocations.map(location => (
                          <TableHead key={location.id} className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{location.code}</span>
                              <span className="text-xs text-muted-foreground">{location.name}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const allowedLocations = getUserAllowedLocations(user);
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge className={getRoleColor(user.role)} variant="secondary">
                                  {user.role}
                                </Badge>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            {mockLocations.map(location => (
                              <TableCell key={location.id} className="text-center">
                                {allowedLocations.includes(location.id) ? (
                                  <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                                    <span className="text-xs text-muted-foreground mt-1">
                                      {user.directLocationIds.includes(location.id) ? 'Direct' : 'Group'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Claims Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map(user => {
                      const allowedLocations = getUserAllowedLocations(user);
                      return (
                        <div key={user.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                          </div>
                          <Badge variant="outline">
                            {allowedLocations.length} locations
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Rules Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Multi-tenant isolation</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Location-based access</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>Role-based permissions</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span>Claims auto-resolution</span>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
              <DialogDescription>
                Configure user role, locations, and group memberships
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter user name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Direct Locations</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {mockLocations.map(location => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${location.id}`} />
                      <Label htmlFor={`loc-${location.id}`} className="text-sm">
                        {location.name} ({location.code})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Group Memberships</Label>
                <div className="space-y-2 mt-2">
                  {locationGroups.map(group => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox id={`group-${group.id}`} />
                      <Label htmlFor={`group-${group.id}`} className="text-sm">
                        {group.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  {selectedUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Group Dialog */}
        <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedGroup ? 'Edit Location Group' : 'Create New Location Group'}
              </DialogTitle>
              <DialogDescription>
                Configure group name, locations, and members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input id="groupName" placeholder="Enter group name" />
              </div>
              <div>
                <Label>Locations</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {mockLocations.map(location => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox id={`group-loc-${location.id}`} />
                      <Label htmlFor={`group-loc-${location.id}`} className="text-sm">
                        {location.name} ({location.code})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Members</Label>
                <div className="space-y-2 mt-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox id={`group-user-${user.id}`} />
                      <Label htmlFor={`group-user-${user.id}`} className="text-sm">
                        {user.name} ({user.role})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  {selectedGroup ? 'Update Group' : 'Create Group'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}