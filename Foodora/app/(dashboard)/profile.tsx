import { ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";
import { logoutUser } from "@/services/authService";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import ProfileHeader from "@/components/ProfileHeader";
import MenuList from "@/components/MenuList";
import LogoutButton from "@/components/LogoutButton";

const Profile = () => {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          showLoader();
          try {
            await logoutUser();
            router.replace("/login");
          } catch {
            Alert.alert("Error", "Logout failed");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    showLoader();
    try {
      if (user) {
        await updateProfile(user, { displayName: name });
        Alert.alert("Success", "Profile updated!");
      }
      setEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      hideLoader();
    }
  };

  const menuItems = [
    { icon: "history", label: "Order History", route: "/orders" },
    { icon: "favorite", label: "Favorites", route: null },
    { icon: "location-on", label: "Delivery Address", route: null },
    { icon: "payment", label: "Payment Methods", route: null },
    { icon: "notifications", label: "Notifications", route: null },
    { icon: "help", label: "Help & Support", route: null },
  ];

  const handleMenuItemPress = (item: any) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

 return (
  <ScrollView
    className="flex-1 bg-gray-50"
    showsVerticalScrollIndicator={false}
  >
    <ProfileHeader
      user={user}
      editing={editing}
      name={name}
      email={user?.email || ""}
      onEditPress={() => setEditing(true)}
      onSavePress={handleSave}
      onNameChange={setName}
    />

    <MenuList items={menuItems} onItemPress={handleMenuItemPress} />

    <ScrollView className="mt-6 mb-10  px-10">
      <LogoutButton onPress={handleLogout} />
    </ScrollView>
  </ScrollView>
);

};

export default Profile;
