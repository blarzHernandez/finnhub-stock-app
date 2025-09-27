import React from "react";
import { View } from "react-native";
import { AddAlertForm } from "../components/AddAlertForm";
import { SafeAreaContainer } from "../../../shared/components/SafeAreaContainer";

export const AddAlertScreen = ({ navigation }: any) => {
  return (
    <SafeAreaContainer>
      <AddAlertForm onSaved={() => navigation.navigate("Watchlist")} />
    </SafeAreaContainer>
  );
};
