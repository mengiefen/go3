We will define authorizations using pundit in policy files. 
We have several entities that can give authorization. before we move forward we should consider that a user will be a member of an organization.
A member can have a user or it might be orphan. 

- member 
  We can grant permissions directly to members and if a user is assigned to that member it will have access.
  Note: a user can be a member of several company. 
- member group (if the member is a member of the group)
  several memebers can be grouped and the permission can be granted to the group. so all members who are a member of the group will get the permission
- role
  if a member is currently assigned to a role he will ge the permission
- department
  all department members will get permissions granted to the department


user has many members
member belongs to a user 
group has meny members 
group belongs to organization 
user belongs to organization (through member)
member has many groups
department belongs to organization
department has many members
member has many departments


based on this requirement use pundit to generate a thorough authorization system. 

please make sure the history of all granted or revoked permissions are maintained with the detail. 