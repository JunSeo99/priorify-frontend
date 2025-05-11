import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 - Priorify",
  description: "Priorify의 개인정보 처리방침입니다. 수집하는 개인정보와 이용 목적을 확인하세요.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">개인정보 처리방침</h1>
          <p className="mt-4 text-gray-600">최종 업데이트: 2023년 12월 1일</p>
        </div>

        <div className="prose prose-blue mx-auto">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 개요</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 사용자의 개인정보를 중요하게 생각하며, 관련 법규를 준수하고 있습니다. 
              본 개인정보 처리방침은 Priorify가 어떤 정보를 수집하고, 어떻게 사용하며, 
              어떻게 보호하는지에 대한 정보를 제공합니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 수집하는 개인정보</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 다음과 같은 개인정보를 수집할 수 있습니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">Google 계정 정보(이름, 이메일 주소, 프로필 사진)</li>
              <li className="mb-2">사용자가 Priorify에 입력한 일정 정보</li>
              <li className="mb-2">사용자의 서비스 이용 기록 및 활동 정보</li>
              <li className="mb-2">접속 IP 주소, 브라우저 유형, 기기 정보</li>
              <li className="mb-2">서비스 개선을 위한 쿠키 및 유사 기술을 통해 수집되는 정보</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 이용 목적</h2>
            <p className="text-gray-700 mb-4">
              수집된 개인정보는 다음과 같은 목적으로 이용됩니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">서비스 제공 및 계정 관리</li>
              <li className="mb-2">사용자 인증 및 보안</li>
              <li className="mb-2">서비스 개선 및 맞춤화</li>
              <li className="mb-2">사용자 지원 및 의사소통</li>
              <li className="mb-2">법적 의무 준수</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보의 보유 및 파기</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 서비스 제공을 위해 필요한 기간 동안 개인정보를 보유합니다. 
              사용자가 계정을 삭제하거나 서비스 이용을 중단할 경우, 관련 법규에서 정한 기간을 제외하고
              사용자의 개인정보는 안전하게 파기됩니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 다음과 같은 경우를 제외하고는 사용자의 개인정보를 제3자에게 제공하지 않습니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">사용자의 명시적 동의가 있는 경우</li>
              <li className="mb-2">법률상 요구되는 경우</li>
              <li className="mb-2">서비스 제공을 위해 필요한 업무 처리 업체에 위탁하는 경우</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 사용자의 권리</h2>
            <p className="text-gray-700 mb-4">
              사용자는 자신의 개인정보에 대해 다음과 같은 권리를 가집니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">개인정보 열람 및 정정 요청</li>
              <li className="mb-2">개인정보 삭제 및 처리 정지 요청</li>
              <li className="mb-2">개인정보 이동 요청</li>
              <li className="mb-2">동의 철회</li>
            </ul>
            <p className="text-gray-700 mb-4">
              위 권리를 행사하고자 하는 경우, Priorify 고객센터로 문의해 주세요.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 개인정보 보호 조치</h2>
            <p className="text-gray-700 mb-4">
              Priorify는 사용자의 개인정보를 보호하기 위해 다음과 같은 보안 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">데이터 암호화</li>
              <li className="mb-2">접근 제어 및 모니터링</li>
              <li className="mb-2">보안 취약점 정기 점검</li>
              <li className="mb-2">직원 교육 및 관리</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보 처리방침 변경</h2>
            <p className="text-gray-700 mb-4">
              본 개인정보 처리방침은 법률 또는 서비스 변경에 따라 수정될 수 있습니다. 
              중요한 변경이 있을 경우, 서비스 내 공지 또는 이메일을 통해 사용자에게 알립니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 문의처</h2>
            <p className="text-gray-700 mb-4">
              개인정보 처리에 관한 문의사항이 있으시면 다음의 연락처로 문의해 주세요:
            </p>
            <p className="text-gray-700 mb-4">
              이메일: 32202337@dankook.ac.kr<br />
              전화: 010-8443-2369
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