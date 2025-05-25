#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <complex.h>

// Define the FFT size
#define N 1024

// Function to compute the FFT
void fft(complex double *X, int n) {
    if (n <= 1) return;

    // Divide
    complex double X_odd[n/2];
    complex double X_even[n/2];
    for (int i = 0; i < n/2; i++) {
        X_even[i] = X[i*2];
        X_odd[i] = X[i*2 + 1];
    }

    // Conquer
    fft(X_even, n/2);
    fft(X_odd, n/2);

    // Combine
    for (int k = 0; k < n/2; k++) {
        complex double t = cexp(-I * 2 * M_PI * k / n) * X_odd[k];
        X[k] = X_even[k] + t;
        X[k + n/2] = X_even[k] - t;
    }
}

// Function to find the period of the signal
double find_period(double *signal, int n, double sampling_rate) {
    // Allocate memory for the FFT result
    complex double X[N];
    for (int i = 0; i < n; i++) {
        X[i] = signal[i];
    }

    // Compute the FFT
    fft(X, n);

    // Find the peak frequency
    int peak_index = 0;
    double max_magnitude = 0.0;
    for (int i = 0; i < n/2; i++) {
        double magnitude = cabs(X[i]);
        if (magnitude > max_magnitude) {
            max_magnitude = magnitude;
            peak_index = i;
        }
    }

    // Calculate the peak frequency
    double peak_frequency = (double)peak_index * sampling_rate / n;

    // Calculate the period
    double period = 1.0 / peak_frequency;

    return period;
}

int main() {
    // Example signal: a sine wave with a period of 0.01 seconds (100 Hz)
    double signal[N];
    double sampling_rate = 1000.0; // 1000 Hz sampling rate
    for (int i = 0; i < N; i++) {
        signal[i] = sin(2 * M_PI * 100 * i / sampling_rate);
    }

    // Find the period of the signal
    double period = find_period(signal, N, sampling_rate);
    printf("Period: %f seconds\n", period);

    return 0;
}


