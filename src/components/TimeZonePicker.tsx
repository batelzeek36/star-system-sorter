/**
 * TimeZonePicker Component
 * Select component for IANA timezone IDs
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';

// Comprehensive IANA timezone IDs grouped by region
const TIMEZONES = [
  // Americas - North America
  'America/New_York', // EST/EDT - Boston, NYC, Miami, Atlanta
  'America/Chicago', // CST/CDT - Chicago, Dallas, Houston
  'America/Denver', // MST/MDT - Denver, Salt Lake City
  'America/Los_Angeles', // PST/PDT - LA, San Francisco, Seattle
  'America/Phoenix', // MST (no DST) - Phoenix, Arizona
  'America/Anchorage', // AKST/AKDT - Alaska
  'America/Honolulu', // HST - Hawaii
  'America/Toronto', // EST/EDT - Toronto, Montreal
  'America/Vancouver', // PST/PDT - Vancouver
  'America/Edmonton', // MST/MDT - Edmonton, Calgary
  'America/Winnipeg', // CST/CDT - Winnipeg
  'America/Halifax', // AST/ADT - Halifax, Nova Scotia
  'America/St_Johns', // NST/NDT - Newfoundland
  'America/Mexico_City', // CST - Mexico City
  'America/Cancun', // EST - Cancun
  'America/Monterrey', // CST - Monterrey
  'America/Tijuana', // PST/PDT - Tijuana
  
  // Americas - Caribbean
  'America/Puerto_Rico', // AST - Puerto Rico, US Virgin Islands
  'America/Jamaica', // EST - Jamaica
  'America/Havana', // CST/CDT - Cuba
  'America/Santo_Domingo', // AST - Dominican Republic
  'America/Port_of_Spain', // AST - Trinidad and Tobago
  
  // Americas - Central America
  'America/Guatemala', // CST - Guatemala
  'America/Belize', // CST - Belize
  'America/San_Jose', // CST - Costa Rica
  'America/Panama', // EST - Panama
  'America/Managua', // CST - Nicaragua
  
  // Americas - South America
  'America/Bogota', // COT - Colombia
  'America/Lima', // PET - Peru
  'America/Santiago', // CLT/CLST - Chile
  'America/Caracas', // VET - Venezuela
  'America/La_Paz', // BOT - Bolivia
  'America/Sao_Paulo', // BRT/BRST - Brazil (São Paulo, Rio)
  'America/Manaus', // AMT - Brazil (Manaus)
  'America/Fortaleza', // BRT - Brazil (Fortaleza)
  'America/Buenos_Aires', // ART - Argentina
  'America/Montevideo', // UYT - Uruguay
  'America/Asuncion', // PYT/PYST - Paraguay
  'America/Guayaquil', // ECT - Ecuador
  
  // Europe - Western
  'Europe/London', // GMT/BST - UK, Ireland
  'Europe/Dublin', // GMT/IST - Ireland
  'Europe/Lisbon', // WET/WEST - Portugal
  'Europe/Madrid', // CET/CEST - Spain
  'Europe/Paris', // CET/CEST - France
  'Europe/Brussels', // CET/CEST - Belgium
  'Europe/Amsterdam', // CET/CEST - Netherlands
  'Europe/Luxembourg', // CET/CEST - Luxembourg
  'Europe/Zurich', // CET/CEST - Switzerland
  
  // Europe - Central
  'Europe/Berlin', // CET/CEST - Germany
  'Europe/Vienna', // CET/CEST - Austria
  'Europe/Rome', // CET/CEST - Italy
  'Europe/Prague', // CET/CEST - Czech Republic
  'Europe/Warsaw', // CET/CEST - Poland
  'Europe/Budapest', // CET/CEST - Hungary
  'Europe/Copenhagen', // CET/CEST - Denmark
  'Europe/Stockholm', // CET/CEST - Sweden
  'Europe/Oslo', // CET/CEST - Norway
  
  // Europe - Eastern
  'Europe/Athens', // EET/EEST - Greece
  'Europe/Bucharest', // EET/EEST - Romania
  'Europe/Sofia', // EET/EEST - Bulgaria
  'Europe/Helsinki', // EET/EEST - Finland
  'Europe/Tallinn', // EET/EEST - Estonia
  'Europe/Riga', // EET/EEST - Latvia
  'Europe/Vilnius', // EET/EEST - Lithuania
  'Europe/Kiev', // EET/EEST - Ukraine
  'Europe/Moscow', // MSK - Russia (Moscow)
  'Europe/Istanbul', // TRT - Turkey
  
  // Asia - Middle East
  'Asia/Dubai', // GST - UAE
  'Asia/Riyadh', // AST - Saudi Arabia
  'Asia/Kuwait', // AST - Kuwait
  'Asia/Bahrain', // AST - Bahrain
  'Asia/Qatar', // AST - Qatar
  'Asia/Jerusalem', // IST - Israel
  'Asia/Beirut', // EET/EEST - Lebanon
  'Asia/Amman', // EET/EEST - Jordan
  'Asia/Damascus', // EET/EEST - Syria
  'Asia/Baghdad', // AST - Iraq
  'Asia/Tehran', // IRST/IRDT - Iran
  
  // Asia - South Asia
  'Asia/Karachi', // PKT - Pakistan
  'Asia/Kolkata', // IST - India
  'Asia/Colombo', // IST - Sri Lanka
  'Asia/Dhaka', // BST - Bangladesh
  'Asia/Kathmandu', // NPT - Nepal
  
  // Asia - Southeast Asia
  'Asia/Bangkok', // ICT - Thailand
  'Asia/Ho_Chi_Minh', // ICT - Vietnam
  'Asia/Singapore', // SGT - Singapore
  'Asia/Kuala_Lumpur', // MYT - Malaysia
  'Asia/Jakarta', // WIB - Indonesia (Jakarta)
  'Asia/Manila', // PST - Philippines
  'Asia/Yangon', // MMT - Myanmar
  'Asia/Phnom_Penh', // ICT - Cambodia
  'Asia/Vientiane', // ICT - Laos
  
  // Asia - East Asia
  'Asia/Hong_Kong', // HKT - Hong Kong
  'Asia/Shanghai', // CST - China
  'Asia/Taipei', // CST - Taiwan
  'Asia/Tokyo', // JST - Japan
  'Asia/Seoul', // KST - South Korea
  'Asia/Pyongyang', // KST - North Korea
  'Asia/Ulaanbaatar', // ULAT - Mongolia
  
  // Pacific - Australia
  'Australia/Sydney', // AEDT/AEST - Sydney, Melbourne
  'Australia/Melbourne', // AEDT/AEST - Melbourne
  'Australia/Brisbane', // AEST - Brisbane
  'Australia/Perth', // AWST - Perth
  'Australia/Adelaide', // ACDT/ACST - Adelaide
  'Australia/Darwin', // ACST - Darwin
  'Australia/Hobart', // AEDT/AEST - Tasmania
  
  // Pacific - New Zealand & Islands
  'Pacific/Auckland', // NZDT/NZST - New Zealand
  'Pacific/Fiji', // FJT - Fiji
  'Pacific/Honolulu', // HST - Hawaii
  'Pacific/Guam', // ChST - Guam
  'Pacific/Pago_Pago', // SST - American Samoa
  'Pacific/Tahiti', // TAHT - French Polynesia
  'Pacific/Port_Moresby', // PGT - Papua New Guinea
  
  // Africa - North
  'Africa/Cairo', // EET - Egypt
  'Africa/Casablanca', // WET - Morocco
  'Africa/Algiers', // CET - Algeria
  'Africa/Tunis', // CET - Tunisia
  'Africa/Tripoli', // EET - Libya
  
  // Africa - West
  'Africa/Lagos', // WAT - Nigeria
  'Africa/Accra', // GMT - Ghana
  'Africa/Dakar', // GMT - Senegal
  'Africa/Abidjan', // GMT - Ivory Coast
  
  // Africa - East
  'Africa/Nairobi', // EAT - Kenya
  'Africa/Addis_Ababa', // EAT - Ethiopia
  'Africa/Dar_es_Salaam', // EAT - Tanzania
  'Africa/Kampala', // EAT - Uganda
  'Africa/Khartoum', // CAT - Sudan
  
  // Africa - South
  'Africa/Johannesburg', // SAST - South Africa
  'Africa/Maputo', // CAT - Mozambique
  'Africa/Harare', // CAT - Zimbabwe
  'Africa/Lusaka', // CAT - Zambia
  
  // Atlantic
  'Atlantic/Reykjavik', // GMT - Iceland
  'Atlantic/Azores', // AZOT/AZOST - Azores
  'Atlantic/Cape_Verde', // CVT - Cape Verde
  'Atlantic/Bermuda', // AST/ADT - Bermuda
];

interface TimeZonePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function TimeZonePicker({value, onChange, error}: TimeZonePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Select time zone"
        accessibilityRole="button"
        accessibilityHint="Opens time zone picker">
        <Text style={[styles.pickerText, !value && styles.placeholder]}>
          {value || 'Select time zone'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Zone</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Close"
                accessibilityRole="button">
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search time zones..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search time zones"
            />

            <FlatList
              data={filteredTimezones}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.timezoneItem,
                    item === value && styles.timezoneItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  accessibilityLabel={item}
                  accessibilityRole="button">
                  <Text
                    style={[
                      styles.timezoneText,
                      item === value && styles.timezoneTextSelected,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  pickerError: {
    borderColor: '#dc2626',
  },
  pickerText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  placeholder: {
    color: '#999999',
  },
  arrow: {
    fontSize: 12,
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    fontSize: 24,
    color: '#666666',
    paddingHorizontal: 8,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    margin: 16,
    fontSize: 16,
    color: '#000000',
  },
  list: {
    flexGrow: 1,
    flexShrink: 1,
  },
  timezoneItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  timezoneItemSelected: {
    backgroundColor: '#f3f4f6',
  },
  timezoneText: {
    fontSize: 16,
    color: '#000000',
  },
  timezoneTextSelected: {
    fontWeight: '600',
  },
});
