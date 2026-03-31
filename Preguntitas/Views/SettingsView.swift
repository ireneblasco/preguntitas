import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(AppLocaleStore.self) private var localeStore

    var body: some View {
        ZStack {
            LinearGradient.appBackground
                .ignoresSafeArea()

            VStack(spacing: 0) {
                HStack {
                    Button {
                        dismiss()
                    } label: {
                        Text("‹")
                            .font(.system(size: 28, weight: .medium))
                            .foregroundStyle(AppColors.textPrimary)
                    }
                    Spacer()
                    Text(String(localized: "settings.title"))
                        .font(.system(size: 18, weight: .bold, design: .serif))
                    Spacer()
                    Color.clear.frame(width: 24, height: 24)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)

                List {
                    Section {
                        Picker(String(localized: "settings.language"), selection: Binding(
                            get: { localeStore.locale },
                            set: { localeStore.locale = $0 }
                        )) {
                            ForEach(AppLocale.settingsMenuOrder) { loc in
                                Text(loc.displayName).tag(loc)
                            }
                        }
                        .pickerStyle(.navigationLink)
                    }
                }
                .scrollContentBackground(.hidden)
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}
