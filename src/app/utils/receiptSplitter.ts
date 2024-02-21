import {
  FinalReceiptSplit,
  Item,
  ProposedSplits,
  Receipt,
  SplitwiseMember,
} from "./types";

interface Split {
  memberId: number;
  cost: number;
}

// Split cost arbitrarily among m members
// Ensures that split is up to 2 decimal places and adds up to `cost`
const splitCost = (cost: number, members: SplitwiseMember[]): Split[] => {
  const numPeople = members.length;
  const evenSplit = cost / numPeople;
  const roundedSplit = Math.floor(evenSplit * 100) / 100;
  let totalRounded = roundedSplit * numPeople;
  let remainder = cost - totalRounded;

  const splits = members.map((member) => ({
    memberId: member.id,
    cost: roundedSplit,
  }));

  let i = 0;
  while (remainder > 0.009) {
    // Use 0.009 to account for floating-point arithmetic issues
    splits[i].cost = parseFloat((splits[i].cost + 0.01).toFixed(2));
    remainder = parseFloat((remainder - 0.01).toFixed(2));
    i = (i + 1) % numPeople;
  }

  return splits;
};

// Only can be used for non-item splitting
const splitAndUpdateCost = (
  costType: "tip" | "serviceFee" | "tax" | "miscFees",
  totalCost: number,
  involvedMembers: SplitwiseMember[],
  finalReceiptSplitObject: FinalReceiptSplit,
) => {
  const costSplit = splitCost(totalCost, involvedMembers);
  costSplit.forEach((memberSplit) => {
    // Find the member in the final receipt object
    const index = finalReceiptSplitObject.members.findIndex(
      (finalMemberSplit) =>
        finalMemberSplit.memberInfo.id === memberSplit.memberId,
    );

    // Safely update the member's cost if found
    if (index !== -1) {
      finalReceiptSplitObject.members[index][costType] = memberSplit.cost;
    }
  });
};

const initializeFinalSplit = (
  members: SplitwiseMember[],
): FinalReceiptSplit => {
  const finalReceiptSplitObject: FinalReceiptSplit = {
    members: [],
    total: 0,
  };
  members.forEach((member) => {
    finalReceiptSplitObject["members"].push({
      memberInfo: member,
      splits: {},
      subtotal: 0,
      tip: 0,
      serviceFee: 0,
      tax: 0,
      miscFees: 0,
      total: 0,
    });
  });
  return finalReceiptSplitObject;
};

export const splitReceipt = (
  receipt: Receipt,
  proposedSplits: ProposedSplits,
  members: SplitwiseMember[],
): FinalReceiptSplit => {
  // Initialize split
  const finalReceiptSplitObject = initializeFinalSplit(members);

  // Split all items
  Object.keys(proposedSplits).forEach((itemName) => {
    // Get cost of item
    const itemCost = receipt.items.filter((item) => item.name == itemName)[0]
      .totalItemPrice;

    // Construct split
    const itemSplit = splitCost(itemCost, proposedSplits[itemName]);

    // Add splits to receipt split object
    itemSplit.forEach((memberSplit) => {
      // Get index that corresponds to member object we want to update
      const index = finalReceiptSplitObject.members.findIndex(
        (finalMemberSplit) =>
          finalMemberSplit.memberInfo.id == memberSplit.memberId,
      );

      // Update
      finalReceiptSplitObject.members[index].splits[itemName] =
        memberSplit.cost;
      finalReceiptSplitObject.members[index].subtotal += memberSplit.cost;
    });
  });

  // Get all members that are involved in the split
  const involvedMembersIdsFlattened = Object.values(proposedSplits)
    .flat()
    .map((member) => member.id);
  const involvedMembersIdSet = new Set(involvedMembersIdsFlattened);
  const involvedMembers = members.filter((member) =>
    involvedMembersIdSet.has(member.id),
  );

  // Split tip, service fee, misc fees and tax
  splitAndUpdateCost(
    "tip",
    receipt.tip,
    involvedMembers,
    finalReceiptSplitObject,
  );
  splitAndUpdateCost(
    "serviceFee",
    receipt.serviceFee,
    involvedMembers,
    finalReceiptSplitObject,
  );
  splitAndUpdateCost(
    "miscFees",
    receipt.miscFees,
    involvedMembers,
    finalReceiptSplitObject,
  );
  splitAndUpdateCost(
    "tax",
    receipt.tax,
    involvedMembers,
    finalReceiptSplitObject,
  );

  // Update total
  finalReceiptSplitObject.members.forEach((member) => {
    const total =
      member.subtotal +
      member.serviceFee +
      member.tax +
      member.tip +
      member.miscFees;
    member.total = parseFloat(total.toFixed(2));
  });

  // Add everything and update total
  finalReceiptSplitObject.total = finalReceiptSplitObject.members.reduce(
    (acc, member) => {
      return acc + member.total;
    },
    0,
  );

  return finalReceiptSplitObject;
};
