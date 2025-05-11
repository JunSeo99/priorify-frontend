import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 약관 - Priorify",
  description: "Priorify 서비스 이용 약관입니다. 서비스 이용 전 반드시 확인해주세요.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">서비스 약관</h1>
          <p className="mt-4 text-gray-600">최종 업데이트: 2025년 5월 12일</p>
        </div>

        <div className="prose prose-blue mx-auto">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 서비스 이용 약관</h2>
            <p className="text-gray-700 mb-4">
              Priorify(이하 "서비스")를 이용해 주셔서 감사합니다. 본 약관은 사용자와 Priorify 서비스 간의 법적 계약을 구성합니다.
              서비스를 이용함으로써 이 약관에 동의하게 됩니다.
            </p>
            <p className="text-gray-700 mb-4">
              본 서비스는 우선순위 기반 일정 관리 도구로써, 사용자가 효율적으로 일정을 관리하고 시각화할 수 있도록 돕습니다.
              사용자는 서비스를 통해 일정을 생성, 관리, 삭제할 수 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 이용 자격</h2>
            <p className="text-gray-700 mb-4">
              서비스를 이용하려면 Google 계정이 필요합니다. 서비스 이용에 필요한 모든 장비와 인터넷 연결은 사용자의 책임입니다.
            </p>
            <p className="text-gray-700 mb-4">
              사용자는 다음과 같은 행위를 하지 않을 것에 동의합니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">서비스의 보안을 우회하거나 침해하는 행위</li>
              <li className="mb-2">법률, 규정 또는 타인의 권리를 위반하는 행위</li>
              <li className="mb-2">서비스의 작동을 방해하는 행위</li>
              <li className="mb-2">악성 코드를 배포하는 행위</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 계정 및 보안</h2>
            <p className="text-gray-700 mb-4">
              Google 로그인을 통해 서비스에 접근할 수 있습니다. 계정 보안은 사용자의 책임이며, 계정과 관련된 모든 활동에 대한 책임은 사용자에게 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 지적 재산권</h2>
            <p className="text-gray-700 mb-4">
              서비스에 포함된 모든 지적 재산권은 Priorify 또는 그 라이센서에게 있습니다. 사용자는 서비스를 이용할 수 있는 제한적, 비독점적, 양도불가능한 라이센스를 부여받습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 서비스 변경 및 종료</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 언제든지 통지 없이 서비스를 수정, 일시 중지 또는 중단할 수 있는 권리를 보유합니다. 서비스 변경이나 종료로 인한 손실에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 책임 제한</h2>
            <p className="text-gray-700 mb-4">
              법률이 허용하는 최대 범위 내에서, Priorify는 서비스 이용으로 인해 발생하는 직접적, 간접적, 부수적, 결과적 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 준거법</h2>
            <p className="text-gray-700 mb-4">
              본 약관은 대한민국 법률에 따라 해석되며, 관련 분쟁은 대한민국 법원의 전속관할로 합니다.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 