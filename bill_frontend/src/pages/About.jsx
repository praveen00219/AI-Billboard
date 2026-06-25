import {
  Shield,
  Eye,
  Users,
  MapPin,
  Camera,
  AlertTriangle,
} from "lucide-react";

function About() {
  return (
    <div className="bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0A0A0A]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#F6F6F6]">
            About BillboardWatch
          </h1>
          <p className="text-xl text-[#F6F6F6]">
            Empowering communities through AI-powered billboard compliance
            monitoring
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6]">
              Our Mission
            </h2>
            <p className="text-lg text-[#F6F6F6] leading-relaxed">
              BillboardWatch is dedicated to creating cleaner, safer, and more
              compliant urban environments through innovative technology and
              community engagement. We believe that by combining artificial
              intelligence with citizen reporting, we can effectively monitor
              and enforce billboard regulations while maintaining transparency
              and accountability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6]">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <Camera className="h-8 w-8 text-[#F6F6F6] mb-2" />
                <h3 className="text-lg font-semibold mb-2 text-[#F6F6F6]">
                  Citizen Reporting
                </h3>
                <p className="text-[#F6F6F6]">
                  Citizens can easily report suspected violations by uploading
                  photos or videos through our user-friendly platform.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <Eye className="h-8 w-8 text-[#F6F6F6] mb-2" />
                <h3 className="text-lg font-semibold mb-2 text-[#F6F6F6]">
                  AI Analysis
                </h3>
                <p className="text-[#F6F6F6]">
                  Our advanced computer vision algorithms analyze submissions to
                  detect various types of violations automatically.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <Users className="h-8 w-8 text-[#F6F6F6] mb-2" />
                <h3 className="text-lg font-semibold mb-2 text-[#F6F6F6]">
                  Authority Review
                </h3>
                <p className="text-[#F6F6F6]">
                  Local authorities can review, verify, and take action on
                  reported violations through our comprehensive dashboard.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <MapPin className="h-8 w-8 text-[#F6F6F6] mb-2" />
                <h3 className="text-lg font-semibold mb-2 text-[#F6F6F6]">
                  Public Transparency
                </h3>
                <p className="text-[#F6F6F6]">
                  Public heatmaps and statistics provide transparency about
                  violation patterns and enforcement actions.
                </p>
              </div>
            </div>
          </section>

          {/* Violation Types */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6]">
              Types of Violations We Detect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <AlertTriangle className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">
                    Size Violations
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">Oversized billboards</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <MapPin className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">
                    Placement Issues
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">Improper positioning</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <Eye className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">
                    Content Violations
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">
                    Inappropriate content
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <Shield className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">Safety Hazards</h3>
                  <p className="text-sm text-[#F6F6F6]">
                    Dangerous installations
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <Users className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">Permit Issues</h3>
                  <p className="text-sm text-[#F6F6F6]">
                    Unauthorized billboards
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-700/50 rounded-lg bg-white/10 backdrop-blur-md">
                <Camera className="h-6 w-6 text-[#F6F6F6]" />
                <div>
                  <h3 className="font-medium text-[#F6F6F6]">
                    Other Violations
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">Custom categories</p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6]">
              Privacy & Data Handling
            </h2>
            <div className="bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-[#F6F6F6]">
                    Image Processing
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">
                    All uploaded images are processed using secure AI
                    algorithms. We analyze billboard content, size, and
                    placement while respecting privacy concerns.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-[#F6F6F6]">
                    Location Data
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">
                    GPS coordinates are used solely for mapping violations and
                    enforcement purposes. Location data is anonymized in public
                    displays.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-[#F6F6F6]">
                    Data Security
                  </h3>
                  <p className="text-sm text-[#F6F6F6]">
                    All data is encrypted and stored securely. We comply with
                    relevant privacy regulations and never share personal
                    information without consent.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6]">
              Get Involved
            </h2>
            <p className="text-lg text-[#F6F6F6] mb-6">
              Join our community of citizens and authorities working together to
              maintain billboard compliance and improve urban environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#F6F6F6]">
                  For Citizens
                </h3>
                <p className="text-[#F6F6F6]">
                  Start reporting violations in your area
                </p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#F6F6F6]">
                  For Authorities
                </h3>
                <p className="text-[#F6F6F6]">
                  Access our enforcement dashboard
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
