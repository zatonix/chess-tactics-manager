import prisma from "./prisma";

export const updateAccountStatus = async (
  accountId: string,
  isFetching: boolean
) => {
  await prisma.chessAccount.update({
    where: {
      id: accountId,
    },
    data: {
      isFetching,
      lastFetch: !isFetching ? new Date() : undefined
    },
  });
};
