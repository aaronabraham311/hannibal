import { SplitwiseGetGroupsResponse } from "@/app/utils/types";

const SPLITWISE_API_ROUTE_GET_GROUPS = "https://secure.splitwise.com/api/v3.0/get_groups"

export async function GET() {
  const groupsApiHeader = new Headers();
  groupsApiHeader.append("Authorization", `Bearer ${process.env.SPLITWISE_API_KEY}`);
  
  // Get groups for user
  const groupsResponse = await fetch(SPLITWISE_API_ROUTE_GET_GROUPS, {
    method: "GET",
    headers: groupsApiHeader
  });
  const groupsData: SplitwiseGetGroupsResponse = await groupsResponse.json();

  // Find the desired group
  const groupName = process.env.SPLITWISE_GROUP_NAME || "";
  const group = groupsData["groups"].filter(group => group.name == groupName)[0];

  return Response.json({ 
    groupId: group.id,
    groupMembers: group.members
  });
}