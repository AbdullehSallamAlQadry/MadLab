"use client"

import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { checkAuthStatus } from '@/components/session';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

export default function MyDocument({report}) {
  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);
  return(
    <div className='w-full h-full'>
      <PDFViewer width={'100%'} height={'100%'}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text>ID: {report?.id || "N/A"}</Text>
              <Text>Status: {report?.status || "Processing"}</Text>
              <Text>Result: {report?.result || "No result yet"}</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
};