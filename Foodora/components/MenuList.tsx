import { View } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuItem from "./MenuItem";

interface MenuItemType {
  icon: string;
  label: string;
  route: string | null;
}

interface MenuListProps {
  items: MenuItemType[];
  onItemPress: (item: MenuItemType) => void;
}

const MenuList = ({ items, onItemPress }: MenuListProps) => {
  return (
    <Animatable.View animation="fadeInUp" delay={300} className="px-5 -mt-14 mb-12">
      <View className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            route={item.route}
            onPress={() => onItemPress(item)}
          />
        ))}
      </View>
    </Animatable.View>
  );
};

export default MenuList;