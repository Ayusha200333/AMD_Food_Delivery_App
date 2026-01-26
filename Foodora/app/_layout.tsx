import { View, Text } from "react-native";
import { Slot } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoaderProvider } from "@/context/LoaderContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"; 

const RootLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <LoaderProvider>
      <AuthProvider>
        <CartProvider> 
          <View
            style={{
              flex: 1,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              backgroundColor: '#f9fafb',
            }}
          >
            <Slot />
          </View>
        </CartProvider>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default RootLayout;