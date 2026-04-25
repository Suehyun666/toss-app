import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateProduct } from "@/services/products";
import { getCoverages, getRiders } from "@/services/master";

export function useProductEditData(productId: number) {
  return useQuery({
    queryKey: ["product-edit-data", productId],
    queryFn: async () => {
      if (!productId || isNaN(productId)) throw new Error("Invalid Product ID");
      const [productRes, coverages, riders] = await Promise.all([
        getProduct(productId),
        getCoverages(),
        getRiders(),
      ]);
      return {
        product: productRes.data ?? productRes,
        coverages,
        riders,
      };
    },
    enabled: !!productId && !isNaN(productId),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["product-edit-data", variables.id] });
    },
  });
}
