import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../../constants/Config";
import {
  KColors as Colors,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/kaamsetuTheme";
import { myApplications, referrals } from "../../constants/mockData";

const API_URL = "http://172.27.16.252:8000";

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
};

type JobType = {
  _id: string;
  category: string;
  description: string;
  address: string;
  status: string;
  minBudget?: number;
  maxBudget?: number;
  noBudget?: boolean;
};

export default function AccountScreen() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [myRequests, setMyRequests] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAccountData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");

      if (!token || !userString) {
        setLoading(false);
        return;
      }

      const parsedUser: UserType = JSON.parse(userString);
      setUser(parsedUser);

      const requestsRes = await fetch(
        `${API_URL}/api/jobs/my-requests/${parsedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const requestsData = await requestsRes.json();

      if (requestsRes.ok && Array.isArray(requestsData)) {
        setMyRequests(requestsData);
      } else {
        setMyRequests([]);
      }
    } catch (error) {
      console.log("Account load error:", error);
      setMyRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/(auth)/login");
  };

  const handleUpdateProfile = () => {
    router.push("/update-profile");
  };

  const handleOpenApplications = () => {
    router.push("/applications");
  };

  const handleOpenReferrals = () => {
    router.push("/referrals");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{user?.name || "User"}</Text>
          <Text style={styles.profileText}>Email: {user?.email || "-"}</Text>
          <Text style={styles.profileText}>Phone: {user?.phone || "-"}</Text>
          <Text style={styles.profileText}>
            Address: {user?.address?.trim() ? user.address : "-"}
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.primaryBtnText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/job-chat?chatId=69c39b7dcf8d1328e3f5ffd1")}
            style={styles.testChatBtn}
          >
            <Text style={styles.testChatBtnText}>Open Test Chat</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>My Requests (Current)</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : myRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No requests found.</Text>
          </View>
        ) : (
          myRequests.map((job) => (
            <View key={job._id} style={styles.requestCard}>
              <Text style={styles.requestTitle}>{job.category}</Text>
              <Text style={styles.requestSub}>{job.description}</Text>
              <Text style={styles.requestSub}>Address: {job.address}</Text>
              <Text style={styles.requestSub}>Status: {job.status}</Text>

              {job.noBudget ? (
                <Text style={styles.requestSub}>Budget: Not specified</Text>
              ) : (
                <Text style={styles.requestSub}>
                  Budget: ₹{job.minBudget || 0} - ₹{job.maxBudget || 0}
                </Text>
              )}

              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => router.push(`/applications?jobId=${job._id}`)}
              >
                <Text style={styles.outlineBtnText}>View Applicants</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>My Applications</Text>

        {myApplications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No applications found.</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.quickCard} onPress={handleOpenApplications}>
            <Text style={styles.quickCardTitle}>Applications</Text>
            <Text style={styles.quickCardSub}>
              {myApplications.length} application(s) available
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Referrals</Text>

        {referrals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No referrals found.</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.quickCard} onPress={handleOpenReferrals}>
            <Text style={styles.quickCardTitle}>Referrals</Text>
            <Text style={styles.quickCardSub}>
              {referrals.length} referral item(s) available
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "700",
  },
  scrollContent: {
    padding: Spacing.md,
    gap: 14,
  },
  centered: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.md,
    gap: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  profileText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },
  testChatBtn: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: "center",
  },
  testChatBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  requestCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.md,
    gap: 6,
  },
  requestTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  requestSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  outlineBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    alignItems: "center",
  },
  outlineBtnText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  quickCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.sm,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  quickCardSub: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logoutBtn: {
    backgroundColor: "#D9534F",
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },
});
