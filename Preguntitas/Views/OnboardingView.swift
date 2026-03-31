import SwiftUI

struct OnboardingView: View {
    let onCompleted: () -> Void

    @State private var page = 0

    private var screens: [(headline: String, subtext: String, cta: String?)] {
        [
            (
                String(localized: "onboarding.screen0.headline"),
                String(localized: "onboarding.screen0.subtext"),
                nil
            ),
            (
                String(localized: "onboarding.screen1.headline"),
                String(localized: "onboarding.screen1.subtext"),
                nil
            ),
            (
                String(localized: "onboarding.screen2.headline"),
                String(localized: "onboarding.screen2.subtext"),
                String(localized: "onboarding.screen2.cta")
            ),
        ]
    }

    var body: some View {
        ZStack {
            LinearGradient.appBackground
                .ignoresSafeArea()

            VStack(spacing: 0) {
                HStack {
                    Button(String(localized: "onboarding.skip")) {
                        complete()
                    }
                    .foregroundStyle(AppColors.textSecondary)
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)

                TabView(selection: $page) {
                    ForEach(Array(screens.enumerated()), id: \.offset) { index, item in
                        OnboardingSlide(
                            headline: item.headline,
                            subtext: item.subtext,
                            pageIndex: index
                        )
                        .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .always))
                .indexViewStyle(.page(backgroundDisplayMode: .always))

                Button {
                    if page < screens.count - 1 {
                        withAnimation { page += 1 }
                    } else {
                        complete()
                    }
                } label: {
                    Text(page < screens.count - 1 ? String(localized: "onboarding.next") : (screens[page].cta ?? String(localized: "onboarding.next")))
                        .font(.system(size: 17, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(AppColors.splashBlue)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 28)
            }
        }
    }

    private func complete() {
        AppPersistence.markOnboardingSeen()
        onCompleted()
    }
}

private struct OnboardingSlide: View {
    let headline: String
    let subtext: String
    let pageIndex: Int

    var body: some View {
        VStack(spacing: 20) {
            RoundedRectangle(cornerRadius: 20)
                .fill(AppColors.cardThemes[pageIndex % AppColors.cardThemes.count].bg)
                .frame(height: 200)
                .overlay {
                    Text("\(["💬", "🌙", "❤️"][pageIndex % 3])")
                        .font(.system(size: 64))
                }
                .padding(.horizontal, 32)
                .padding(.top, 24)

            VStack(alignment: .leading, spacing: 12) {
                Text(headline)
                    .font(.system(size: 26, weight: .bold, design: .serif))
                    .foregroundStyle(AppColors.textPrimary)
                Text(subtext)
                    .font(.system(size: 17))
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 28)

            Spacer()
        }
    }
}
