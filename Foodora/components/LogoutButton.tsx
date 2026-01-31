import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton = ({ onPress }: LogoutButtonProps) => {
  return (
    <TouchableOpacity
      className="mt-10 bg-red-50 py-6 rounded-3xl items-center shadow-lg"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <MaterialIcons name="logout" size={30} color="#EF4444" />
        <Text className="text-red-700 font-bold text-lg ml-4">Logout</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LogoutButton;