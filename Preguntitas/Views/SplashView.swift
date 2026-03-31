import SwiftUI

struct SplashView: View {
    let onFinished: () -> Void

    @State private var logoScale: CGFloat = 0.001
    @State private var logoOpacity: Double = 0
    @State private var textOpacity: Double = 0
    @State private var containerOpacity: Double = 1

    var body: some View {
        ZStack {
            LinearGradient.splashBackground
                .ignoresSafeArea()

            VStack(spacing: 24) {
                Text("Shallow")
                    .font(.system(size: 44, weight: .bold, design: .serif))
                    .foregroundStyle(.white)
                    .scaleEffect(logoScale)
                    .opacity(logoOpacity)

                Text(String(localized: "splash.tagline"))
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(.white.opacity(0.95))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                    .opacity(textOpacity)
            }
        }
        .opacity(containerOpacity)
        .onAppear {
            withAnimation(.spring(response: 0.55, dampingFraction: 0.72).delay(0.2)) {
                logoScale = 1
                logoOpacity = 1
            }
            withAnimation(.easeOut(duration: 0.6).delay(0.6)) {
                textOpacity = 1
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) {
                withAnimation(.easeInOut(duration: 0.45)) {
                    logoOpacity = 0
                    textOpacity = 0
                    logoScale = 0.92
                }
                withAnimation(.easeInOut(duration: 0.55).delay(0.2)) {
                    containerOpacity = 0
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) {
                    onFinished()
                }
            }
        }
    }
}
