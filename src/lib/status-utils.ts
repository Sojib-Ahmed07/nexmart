export const getStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    PAYMENT_PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    PROCESSING: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    SHIPPED: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    DELIVERED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
  };
  return styles[status] || styles.PAYMENT_PENDING;
};
