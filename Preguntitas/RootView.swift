import SwiftUI

private enum AppPhase {
    case splash
    case onboarding
    case main
}

struct RootView: View {
    @Environment(AppLocaleStore.self) private var localeStore
    @State private var phase: AppPhase = .splash

    var body: some View {
        ZStack {
            switch phase {
            case .splash:
                SplashView {
                    finishSplash()
                }
            case .onboarding:
                OnboardingView {
                    phase = .main
                }
            case .main:
                HomeView()
            }
        }
        .animation(.easeInOut(duration: 0.35), value: phase)
        .environment(\.locale, Locale(identifier: localeStore.locale.rawValue))
        #if DEBUG
        .onReceive(NotificationCenter.default.publisher(for: .devResetOnboarding)) { _ in
            phase = .onboarding
        }
        #endif
    }

    private func finishSplash() {
        if AppPersistence.hasSeenOnboarding() {
            phase = .main
        } else {
            phase = .onboarding
        }
    }
}
