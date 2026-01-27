import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@core/theme';
import { currentBrand } from '@core/config/brand.config';
import { Button, Card, Input } from '@shared/components';
import { Text } from '@shared/components/Text/Text';
import { Header } from '@shared/components/Header/Header';

export const BrandPreviewScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Brand Preview" subtitle={currentBrand.id} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* Brand Info */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Brand Information
          </Text>
          <View style={styles.row}>
            <Text variant="label">ID:</Text>
            <Text>{currentBrand.id}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="label">App Name:</Text>
            <Text>{currentBrand.appName}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="label">Slug:</Text>
            <Text>{currentBrand.slug}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="label">Tenant:</Text>
            <Text>{currentBrand.defaultTenantId}</Text>
          </View>
        </Card>

        {/* Color Palette */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Color Palette
          </Text>
          <View style={styles.colorGrid}>
            <ColorSwatch label="Primary" color={theme.colors.primary} />
            <ColorSwatch label="Secondary" color={theme.colors.secondary} />
            <ColorSwatch label="Accent" color={theme.colors.accent} />
            <ColorSwatch label="Error" color={theme.colors.error} />
            <ColorSwatch label="Success" color={theme.colors.success} />
            <ColorSwatch label="Warning" color={theme.colors.warning} />
          </View>
        </Card>

        {/* Typography Preview */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Typography
          </Text>
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="body">Body text - Regular paragraph content</Text>
          <Text variant="bodySmall">Body Small - Secondary content</Text>
          <Text variant="caption" color="secondary">
            Caption - Metadata and hints
          </Text>
        </Card>

        {/* Component Preview */}
        <Card style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Components
          </Text>
          <Button
            title="Primary Button"
            onPress={() => {}}
            variant="primary"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Secondary Button"
            onPress={() => {}}
            variant="secondary"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Outline Button"
            onPress={() => {}}
            variant="outline"
            fullWidth
            style={styles.button}
          />
          <Input
            label="Sample Input"
            placeholder="Enter text..."
            containerStyle={styles.input}
          />
          <Input
            label="Input with Error"
            placeholder="Enter text..."
            error="This field is required"
          />
        </Card>
      </ScrollView>
    </View>
  );
};

interface ColorSwatchProps {
  label: string;
  color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ label, color }) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <Text variant="caption">{label}</Text>
    <Text variant="caption" color="secondary">
      {color}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  colorSwatch: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  colorBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 4,
  },
  button: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
});
