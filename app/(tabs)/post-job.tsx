import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  KColors as Colors,
  Spacing
} from "../../constants/kaamsetuTheme";

export default function PostJob() {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [durationType, setDurationType] = useState("one-day");

  const [endDate, setEndDate] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [noBudget, setNoBudget] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Cleaning",
    "Cooking",
    "Plumbing",
    "Electrician",
    "Babysitting",
    "Laundry",
    "Gardening",
    "Driver",
    "Carpenter",
    "Painter",
    "Other",
  ];

  // normalize today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // HANDLERS
  const handleDateChange = (_: any, d: any) => {
    setShowPicker(false);
    if (d) setDate(d);
  };

  const handleEndDateChange = (_: any, d: any) => {
    setShowEndPicker(false);
    if (d) setEndDate(d);
  };

  const handleStartTimeChange = (_: any, t: any) => {
    setShowStartPicker(false);
    if (t) setStartTime(t);
  };

  const handleEndTimeChange = (_: any, t: any) => {
    setShowEndTimePicker(false);
    if (t) setEndTime(t);
  };

  // VALIDATION
  const validateForm = () => {
    if (!category) return (setError("Select category"), false);

    if (category === "Other" && !customCategory.trim())
      return (setError("Enter custom category"), false);

    if (!description.trim()) return (setError("Enter description"), false);

    if (!date) return (setError("Select start date"), false);

    if (durationType === "multiple-days") {
      if (!endDate) return (setError("Select end date"), false);
      if (endDate < date)
        return (setError("End date cannot be before start date"), false);
    }

    if (!noBudget && (!minBudget || !maxBudget))
      return (setError("Enter budget"), false);

    if (!noBudget && Number(minBudget) > Number(maxBudget))
      return (setError("Min budget > Max budget"), false);

    if (!address.trim()) return (setError("Enter address"), false);

    if (endTime <= startTime)
      return (setError("End time must be after start time"), false);

    setError("");
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post Job</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post New Job</Text>

        {/* CATEGORY */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.card}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Select category" value="" />
            {categories.map((item, i) => (
              <Picker.Item key={i} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {category === "Other" && (
          <View style={styles.inputContainer}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
            <TextInput
              placeholder="Custom category"
              style={styles.inputFlex}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          </View>
        )}

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description *</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={Colors.primary}
          />
          <TextInput
            style={styles.inputFlex}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe job"
          />
        </View>

        {/* START DATE */}
        <Text style={styles.label}>Start Date *</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={{ marginLeft: 10 }}>{date.toDateString()}</Text>
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={today} // ✅ today + future
            onChange={handleDateChange}
          />
        )}

        {/* DURATION */}
        <Text style={styles.label}>Duration</Text>
        <View style={styles.durationContainer}>
          {["one-day", "multiple-days"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.durationButton,
                durationType === type && styles.durationSelected,
              ]}
              onPress={() => setDurationType(type)}
            >
              <Text
                style={[
                  styles.durationText,
                  durationType === type && { color: Colors.white },
                ]}
              >
                {type === "one-day" ? "One Day" : "Multiple Days"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* END DATE */}
        {durationType === "multiple-days" && (
          <>
            <Text style={styles.label}>End Date *</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={{ marginLeft: 10 }}>{endDate.toDateString()}</Text>
              </View>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={handleEndDateChange}
              />
            )}
          </>
        )}

        {/* TIME */}
        <Text style={styles.label}>Preferred Time *</Text>

        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="play-circle-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={{ marginLeft: 10 }}>
              {startTime.toLocaleTimeString()}
            </Text>
          </View>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            onChange={handleStartTimeChange}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="stop-circle-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={{ marginLeft: 10 }}>
              {endTime.toLocaleTimeString()}
            </Text>
          </View>
        </TouchableOpacity>

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            onChange={handleEndTimeChange}
          />
        )}

        {/* BUDGET */}
        <Text style={styles.label}>Budget *</Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setNoBudget(!noBudget)}
        >
          <View style={styles.checkbox}>
            {noBudget && <View style={styles.checkboxInner} />}
          </View>
          <Text>No Budget</Text>
        </TouchableOpacity>

        {!noBudget && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              <TextInput
                placeholder="Min"
                keyboardType="numeric"
                style={styles.inputFlex}
                value={minBudget}
                onChangeText={(text) =>
                  setMinBudget(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              <TextInput
                placeholder="Max"
                keyboardType="numeric"
                style={styles.inputFlex}
                value={maxBudget}
                onChangeText={(text) =>
                  setMaxBudget(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>
          </>
        )}

        {/* ADDRESS */}
        <Text style={styles.label}>Address *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color={Colors.primary} />
          <TextInput
            placeholder="Enter address"
            style={styles.inputFlex}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* ERROR */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!validateForm()) return;
            Alert.alert("Success 🎉", "Job posted successfully!");
          }}
        >
          <Text style={styles.buttonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },

  header: {
    backgroundColor: Colors.primary,
    padding: 14,
    alignItems: "center",
  },

  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  label: {
    marginTop: 12,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
  },

  inputFlex: {
    flex: 1,
    marginLeft: 10,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },

  durationContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  durationButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
  },

  durationSelected: {
    backgroundColor: Colors.primary,
  },

  durationText: {
    color: Colors.primary,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 10,
  },

  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    margin: 3,
  },

  card: {
    marginTop: 6,
  },
});
