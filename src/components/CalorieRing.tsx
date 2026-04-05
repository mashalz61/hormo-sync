import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  Easing,
  createAnimatedComponent,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/theme";
import { formatKcalForDisplay, formatKcalWithUnit } from "@/utils/calorieResponse";

const AnimatedCircle = createAnimatedComponent(Circle);

interface CalorieRingProps {
  consumedCalories: number;
  burnedCalories: number;
  netCalories: number;
  consumedGoal?: number;
  burnedGoal?: number;
  size?: number;
}

export const CalorieRing = ({
  consumedCalories,
  burnedCalories,
  netCalories,
  consumedGoal = 2200,
  burnedGoal = 800,
  size = 240,
}: CalorieRingProps) => {
  const strokeWidth = 18;
  const innerStrokeWidth = 14;
  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = outerRadius - 30;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const ringCenterSize = size * 0.43;

  const consumedProgress = useSharedValue(consumedCalories / consumedGoal);
  const burnedProgress = useSharedValue(burnedCalories / burnedGoal);
  const animatedConsumed = useSharedValue(consumedCalories);
  const animatedBurned = useSharedValue(burnedCalories);
  const animatedNet = useSharedValue(netCalories);

  const [displayValues, setDisplayValues] = useState({
    consumed: consumedCalories,
    burned: burnedCalories,
    net: netCalories,
  });

  useEffect(() => {
    consumedProgress.value = withTiming(Math.min(consumedCalories / consumedGoal, 1), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
    burnedProgress.value = withTiming(Math.min(burnedCalories / burnedGoal, 1), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
    animatedConsumed.value = withTiming(consumedCalories, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
    animatedBurned.value = withTiming(burnedCalories, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
    animatedNet.value = withTiming(netCalories, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    animatedBurned,
    animatedConsumed,
    animatedNet,
    burnedCalories,
    burnedGoal,
    burnedProgress,
    consumedCalories,
    consumedGoal,
    consumedProgress,
    netCalories,
  ]);

  useAnimatedReaction(
    () => ({
      consumed: Math.round(animatedConsumed.value * 100) / 100,
      burned: Math.round(animatedBurned.value * 100) / 100,
      net: Math.round(animatedNet.value * 100) / 100,
    }),
    (current, previous) => {
      if (
        !previous ||
        current.consumed !== previous.consumed ||
        current.burned !== previous.burned ||
        current.net !== previous.net
      ) {
        runOnJS(setDisplayValues)(current);
      }
    },
  );

  const consumedAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: outerCircumference * (1 - consumedProgress.value),
  }));

  const burnedAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: innerCircumference * (1 - burnedProgress.value),
  }));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.heading}>Calorie Cycle Tracker</Text>
          <Text style={styles.subheading}>Consumed and burned calories stay synced in real time.</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.livePillText}>Live</Text>
        </View>
      </View>

      <View style={styles.ringShell}>
        <View style={styles.ringGlowOuter} />
        <Svg height={size} style={styles.svg} width={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={outerRadius}
            stroke="#F2DCE5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            animatedProps={consumedAnimatedProps}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={outerRadius}
            rotation="-90"
            originX={size / 2}
            originY={size / 2}
            stroke="#E6789F"
            strokeLinecap="round"
            strokeDasharray={`${outerCircumference} ${outerCircumference}`}
            strokeWidth={strokeWidth}
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={innerRadius}
            stroke="#EEE9D6"
            strokeWidth={innerStrokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            animatedProps={burnedAnimatedProps}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={innerRadius}
            rotation="-90"
            originX={size / 2}
            originY={size / 2}
            stroke="#76B892"
            strokeLinecap="round"
            strokeDasharray={`${innerCircumference} ${innerCircumference}`}
            strokeWidth={innerStrokeWidth}
          />
        </Svg>

        <View style={[styles.centerContent, { width: ringCenterSize, minHeight: ringCenterSize }]}>
          <View style={styles.centerBadge}>
            <Ionicons color="#D45C85" name="flame" size={14} />
            <Text style={styles.centerBadgeText}>Today</Text>
          </View>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.netValue}>
            {formatKcalForDisplay(displayValues.net)}
          </Text>
          <Text style={styles.netUnit}>net kcal</Text>
          <Text numberOfLines={2} style={styles.centerHint}>
            consumed minus burned
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <TrackerStat
          accentColor="#E6789F"
          icon="restaurant"
          label="Calories Consumed"
          value={formatKcalWithUnit(displayValues.consumed)}
        />
        <TrackerStat
          accentColor="#76B892"
          icon="walk"
          label="Calories Burned"
          value={formatKcalWithUnit(displayValues.burned)}
        />
      </View>
    </View>
  );
};

interface TrackerStatProps {
  accentColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const TrackerStat = ({ accentColor, icon, label, value }: TrackerStatProps) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconShell, { backgroundColor: `${accentColor}1A` }]}>
      <Ionicons color={accentColor} name={icon} size={16} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E8D3DD",
    backgroundColor: "rgba(255,248,251,0.96)",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "#FFF1F6",
    borderWidth: 1,
    borderColor: "#EDD5E0",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D45C85",
  },
  livePillText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  heading: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  subheading: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  ringShell: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },
  ringGlowOuter: {
    position: "absolute",
    width: 214,
    height: 214,
    borderRadius: 999,
    backgroundColor: "#FFF0F5",
  },
  svg: {
    transform: [{ rotate: "180deg" }],
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 10,
  },
  centerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "#FCEAF1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  centerBadgeText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  netValue: {
    ...theme.typography.display,
    color: theme.colors.text,
    lineHeight: 34,
    maxWidth: "100%",
  },
  netUnit: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    textAlign: "center",
  },
  centerHint: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
    maxWidth: "100%",
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: "#EBD7E0",
  },
  statIconShell: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  statValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
});
