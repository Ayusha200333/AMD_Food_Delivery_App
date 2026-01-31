import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface MenuItemProps {
  icon: string;
  label: string;
  route: string | null;
  onPress: () => void;
}

const MenuItem = ({ icon, label, route, onPress }: MenuItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center px-6 py-6 border-b border-gray-100 last:border-b-0 active:bg-indigo-50/30"
      onPress={onPress}
    >
      <View className="bg-indigo-100 p-4 rounded-2xl mr-5">
        <MaterialIcons name={icon as any} size={30} color="#4F46E5" />
      </View>
      <Text className="flex-1 text-gray-900 font-semibold text-lg">
        {label}
      </Text>
      <MaterialIcons name="chevron-right" size={30} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default MenuItem;