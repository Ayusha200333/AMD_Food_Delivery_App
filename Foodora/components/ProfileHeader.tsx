import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

interface ProfileHeaderProps {
  user: any;
  editing: boolean;
  name: string;
  email: string;
  onEditPress: () => void;
  onSavePress: () => void;
  onNameChange: (text: string) => void;
}

const ProfileHeader = ({
  user,
  editing,
  name,
  email,
  onEditPress,
  onSavePress,
  onNameChange,
}: ProfileHeaderProps) => {
  return (
    <Animatable.View
      animation="fadeInDown"
      className="bg-purple-950 px-6 pt-16 pb-20 rounded-b-[60px]"
    >
      <View className="items-center">
        <View className="bg-white/30 p-5 rounded-full mb-4 border-2 border-white/40 shadow-xl">
          <MaterialIcons name="person" size={88} color="white" />
        </View>

        {editing ? (
          <View className="w-full px-4">
            <TextInput
              className="bg-white/40 text-white text-2xl font-bold text-center p-4 rounded-2xl mb-3 border border-white/50"
              value={name}
              onChangeText={onNameChange}
              placeholder="Your Name"
              placeholderTextColor="rgba(255,255,255,0.8)"
            />
            <Text className="text-white/90 text-center text-lg">{email}</Text>
          </View>
        ) : (
          <>
            <Text className="text-white text-4xl font-extrabold tracking-wide">
              {user?.displayName || "Welcome"}
            </Text>
            <Text className="text-white/90 mt-2 text-lg">{email}</Text>
          </>
        )}

        <TouchableOpacity
          className={`mt-6 px-10 py-4 rounded-full ${
            editing ? "bg-white" : "bg-white/30 border-2 border-white/40"
          }`}
          onPress={editing ? onSavePress : onEditPress}
        >
          <Text
            className={`font-bold text-lg ${
              editing ? "text-indigo-700" : "text-white"
            }`}
          >
            {editing ? "Save Profile" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

export default ProfileHeader;