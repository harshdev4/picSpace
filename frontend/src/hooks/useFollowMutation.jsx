import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

const handleFollow = async (username) => {
  try {
    const res = await axiosInstance.patch(`/user/follow/${username}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const useFollowMutation = (username, userId) => {
  const queryClient = useQueryClient();

  const loggedInUser = queryClient.getQueryData(['user']);

  return useMutation({
    mutationFn: () => handleFollow(username),

    onMutate: async () => {
      await queryClient.cancelQueries(['user']);
      const previousDataUser = queryClient.getQueryData(['user']);

      queryClient.setQueryData(['user'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          following: oldData.following.includes(userId)
            ? oldData.following.filter((user) => user !== userId)
            : [...oldData.following, userId],
        };
      });

      await queryClient.cancelQueries(["profile", username]);
      const previousDataProfile = queryClient.getQueryData(["profile", username]);

      if (previousDataProfile) {
        queryClient.setQueryData(["profile", username], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followers: oldData.followers.includes(loggedInUser.id)
              ? oldData.followers.filter((userId) => userId !== loggedInUser.id)
              : [...oldData.followers, loggedInUser.id],
          };
        });
      }

      return { previousDataUser, previousDataProfile };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(['user'], context.previousDataUser);
      queryClient.setQueryData(["profile", username], context.previousDataProfile);
      toast.error(error.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["profile", username]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () => handleFollow(username),

//     onMutate: async () => {
//       await queryClient.cancelQueries(["profile", username]);
//       const previousData = queryClient.getQueryData(["profile", username]);

//       queryClient.setQueryData(["profile", username], (oldData) => {
//         if (!oldData) return oldData;
//         return {
//           ...oldData,
//           followers: oldData.followers.includes(loggedInUser.id)
//             ? oldData.followers.filter((userId) => userId !== loggedInUser.id)
//             : [...oldData.followers, loggedInUser.id],
//         };
//       });

//       return { previousData };
//     },

//     onError: (error, _, context) => {
//       queryClient.setQueryData(["profile", username], context.previousData);
//       toast.error(error.message);
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries(["profile", username]);
//       queryClient.invalidateQueries(['user']);
//     },
//   });
// };
