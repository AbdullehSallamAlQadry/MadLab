"use client"

import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { checkAuthStatus } from '@/lib/session';

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
    borderBottomStyle: 'dashed',
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoSpam: {
    color: '#2E7D32',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    borderLeftStyle: 'solid',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%'
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  thumbnail: {
    width: '48%',
    marginBottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageStyle: {
    width: 85,
    height: 85,
  },
  caption: {
    fontSize: 10,
    color: '#424242',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#424242',
  },
  value: {
    fontSize: 12,
    color: '#212121',
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderStyle: 'solid',
    borderRadius: 4,
    marginTop: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  confidenceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  confidenceText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: 'bold',
  },
  notesSection: {
    padding: 12,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFECB3',
    borderStyle: 'solid',
    borderRadius: 4,
    marginTop: 5,
  },
  notesText: {
    fontSize: 11,
    color: '#5D4037',
    lineHeight: 1.4,
  },
  disclaimer: {

    paddingTop: 15,
    borderTopWidth: 1,
    borderTopStyle: 'dashed',
    borderTopColor: '#BDBDBD',
    fontSize: 9,
    color: '#757575',
    lineHeight: 1.3,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#9E9E9E',
  },
});

export default function MyDocument({ report }) {
  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  const getResultColors = (result) => {
    const defaultColor = { text: '#212121', bg: '#E8EAF6', border: '#C5CAE9' };
    const map = {
      'malignant': { text: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A' },
      'melanoma': { text: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A' },
      'malignancy': { text: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A' },
      'precancerous': { text: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
      'precancer': { text: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
      'benign': { text: '#1B5E20', bg: '#E8F5E9', border: '#C8E6C9' },
      'normal': { text: '#1B5E20', bg: '#E8F5E9', border: '#C8E6C9' }
    };

    if (!result) return defaultColor;
    const key = String(result).toString().trim().toLowerCase();
    if (map[key]) return map[key];

    // fallback to substring checks for partial matches
    if (key.includes('malignan') || key.includes('malign')) return map['malignant'];
    if (key.includes('precancer') || key.includes('pre-cancer')) return map['precancer'];
    if (key.includes('benign') || key.includes('normal')) return map['benign'];

    return defaultColor;
  };

  const resultColors = getResultColors(report?.result);
  const samples = report?.image_samples || [];
  const imgCount = samples.length;
  const columns = imgCount <= 1 ? 1 : imgCount === 2 ? 2 : 3; 
  const thumbWidth = `${Math.floor(100 / columns) - 2}%`;

  return (
    <div className='w-full h-full'>
      <PDFViewer width={'100%'} height={'100%'}>
        <Document>
          <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}><Text style={styles.logoSpam}>M</Text>ed<Text style={styles.logoSpam}>M</Text>ind</Text>
                <Text style={styles.title}>Diagnostic Report</Text>
              </View>
              <Text style={styles.subtitle}>AI-Powered Medical Diagnostic Analysis</Text>
            </View>

            {/* Report Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Report Information</Text>
              <View style={styles.infoSection}>
                <View style={styles.row}>
                  <Text style={styles.label}>Report ID:</Text>
                  <Text style={styles.value}>{report?.id || "N/A"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date & Time:</Text>
                  <Text style={styles.value}>
                      {report?.created_at ? new Date(report.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Doctor Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Doctor Information</Text>
              <View style={styles.infoSection}>
                <View style={styles.row}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{report?.doctor?.name || report?.doctor_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Specialization:</Text>
                  <Text style={styles.value}>{report?.doctor?.specialization || report?.doctor_specialization || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{report?.doctor?.email || report?.doctor_email || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Patient Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Information</Text>
              <View style={styles.infoSection}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Age:</Text>
                    <Text style={styles.value}>{report?.age ?? 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Blood Type:</Text>
                    <Text style={styles.value}>{report?.blood_type || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Lesion Location:</Text>
                    <Text style={styles.value}>{report?.lesion_location || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Asymmetry:</Text>
                    <Text style={styles.value}>{(report?.asymmetry) ? "Yes" : "No"}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Color Variation:</Text>
                    <Text style={styles.value}>{(report?.color_variation) ? "Yes" : "No"}</Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Gender:</Text>
                    <Text style={styles.value}>{report?.gender || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Lesion Size:</Text>
                    <Text style={styles.value}>{report?.lesion_size_mm ?? 'N/A'} mm</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Diameter:</Text>
                    <Text style={styles.value}>{report?.diameter_mm ?? 'N/A'} mm</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Border Irregularity:</Text>
                    <Text style={styles.value}>{(report?.border_irregularity) ? "Yes" : "No"}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Evolution:</Text>
                    <Text style={styles.value}>{(report?.evolution) ? "Yes" : "No"}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Findings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnostic Findings</Text>
              <View style={{ ...styles.resultBox, backgroundColor: resultColors.bg, border: `1 solid ${resultColors.border}` }}>
                <Text style={{ ...styles.resultText, color: resultColors.text }}>Result: {report?.result || 'No result yet'}</Text>
                {report?.final_confidence !== undefined && (
                  <Text style={{ ...styles.confidenceText, color: resultColors.text }}>
                    Confidence: {(Number(report.final_confidence) * 100).toFixed(2)}%
                  </Text>
                )}
              </View>
              <View style={styles.imagesGrid}>
                {(report?.image_samples || []).map((sample, idx) => (
                    <View style={{ ...styles.thumbnail, width: thumbWidth }} key={sample.id || idx}>
                      {sample.image && (
                        <Image src={sample.image} style={styles.imageStyle}  />
                      )}
                      {sample.result && sample.result[0] && sample.result[0].xai_image && (
                        <Image src={sample.result[0].xai_image} style={{ ...styles.imageStyle, marginTop: 6 }} />
                      )}
                      <Text style={styles.caption}>Sample #{idx + 1}</Text>
                    </View>
                ))}
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Text>
                *This report contains AI-generated predictions and visual explanations (Grad-CAM) provided by MedMind to assist clinical decision making. 
                The results should be reviewed and verified by qualified medical professionals. 
                If XAI images are available they can be viewed in the web portal alongside this report.
              </Text>
              <Text style={{ marginTop: 8 }}>
                Website: https://medmind.site | Generated on: {new Date().toLocaleDateString()}
              </Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              MedMind AI Diagnostic System | Confidential Medical Document
            </Text>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}