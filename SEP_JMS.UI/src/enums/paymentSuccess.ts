export const PaymentSuccess = {
  PAID: true,
  UNPAID: false
};

export const PaymentSuccessOptions = [
  {
    key: PaymentSuccess.UNPAID,
    text: "Chưa thanh toán"
  },
  {
    key: PaymentSuccess.PAID,
    text: "Đa thanh toán"
  }
];
